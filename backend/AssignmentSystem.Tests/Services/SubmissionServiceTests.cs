using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Submissions;
using AssignmentSystem.Models;
using AssignmentSystem.Services;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Tests.Services;

public class SubmissionServiceTests
{
    private AppDbContext CreateInMemoryDb(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static void SeedData(AppDbContext db)
    {
        db.Classes.Add(new Class { Id = 1, Name = "Class A" });
        db.Users.AddRange(
            new User { Id = 1, Name = "Teacher", Email = "t@t.com", PasswordHash = "h", Role = "Teacher" },
            new User { Id = 2, Name = "Student", Email = "s@s.com", PasswordHash = "h", Role = "Student", ClassId = 1 }
        );
        db.Assignments.Add(new Assignment
        {
            Id = 1, Title = "HW1", Description = "Do it",
            Deadline = DateTime.UtcNow.AddDays(7),
            MaxMarks = 100, Status = AssignmentStatus.Published,
            TeacherId = 1, ClassId = 1, SubjectId = 1
        });
        db.SaveChanges();
    }

    [Fact]
    public async Task CreateAsync_ValidSubmission_CreatesSuccessfully()
    {
        var db = CreateInMemoryDb("submit_valid");
        SeedData(db);
        var service = new SubmissionService(db);

        var dto = new CreateSubmissionDto { Answer = "My answer", AssignmentId = 1 };
        var result = await service.CreateAsync(studentId: 2, dto);

        Assert.NotNull(result);
        Assert.Equal("My answer", result.Answer);
        Assert.Equal("Submitted", result.Status);
    }

    [Fact]
    public async Task CreateAsync_DuplicateSubmission_ThrowsInvalidOperation()
    {
        var db = CreateInMemoryDb("submit_duplicate");
        SeedData(db);
        db.Submissions.Add(new Submission
        {
            Id = 1, Answer = "First", StudentId = 2, AssignmentId = 1
        });
        db.SaveChanges();

        var service = new SubmissionService(db);
        var dto = new CreateSubmissionDto { Answer = "Second", AssignmentId = 1 };

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateAsync(studentId: 2, dto));
    }

    [Fact]
    public async Task CreateAsync_PastDeadline_ThrowsInvalidOperation()
    {
        var db = CreateInMemoryDb("submit_past_deadline");
        SeedData(db);

        // Modify assignment to have past deadline
        var assignment = await db.Assignments.FindAsync(1);
        assignment!.Deadline = DateTime.UtcNow.AddDays(-1);
        await db.SaveChangesAsync();

        var service = new SubmissionService(db);
        var dto = new CreateSubmissionDto { Answer = "Late", AssignmentId = 1 };

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateAsync(studentId: 2, dto));
    }

    [Fact]
    public async Task GradeAsync_ValidTeacher_GradesSuccessfully()
    {
        var db = CreateInMemoryDb("grade_valid");
        SeedData(db);
        db.Submissions.Add(new Submission
        {
            Id = 1, Answer = "Answer", StudentId = 2, AssignmentId = 1
        });
        db.SaveChanges();

        var service = new SubmissionService(db);
        var dto = new GradeSubmissionDto { MarksAwarded = 85, Feedback = "Good work!" };

        var result = await service.GradeAsync(id: 1, teacherId: 1, dto);

        Assert.NotNull(result);
        Assert.Equal(85, result.MarksAwarded);
        Assert.Equal("Good work!", result.Feedback);
        Assert.Equal("Graded", result.Status);
    }

    [Fact]
    public async Task GradeAsync_WrongTeacher_ThrowsUnauthorized()
    {
        var db = CreateInMemoryDb("grade_unauthorized");
        SeedData(db);
        db.Submissions.Add(new Submission
        {
            Id = 1, Answer = "Answer", StudentId = 2, AssignmentId = 1
        });
        db.SaveChanges();

        var service = new SubmissionService(db);
        var dto = new GradeSubmissionDto { MarksAwarded = 50 };

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.GradeAsync(id: 1, teacherId: 99, dto));
    }

    [Fact]
    public async Task GradeAsync_MarksExceedMax_ThrowsInvalidOperation()
    {
        var db = CreateInMemoryDb("grade_exceed_max");
        SeedData(db);
        db.Submissions.Add(new Submission
        {
            Id = 1, Answer = "Answer", StudentId = 2, AssignmentId = 1
        });
        db.SaveChanges();

        var service = new SubmissionService(db);
        var dto = new GradeSubmissionDto { MarksAwarded = 150 }; // MaxMarks is 100

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.GradeAsync(id: 1, teacherId: 1, dto));
    }

    [Fact]
    public async Task UpdateAsync_GradedSubmission_ThrowsInvalidOperation()
    {
        var db = CreateInMemoryDb("update_graded");
        SeedData(db);
        db.Submissions.Add(new Submission
        {
            Id = 1, Answer = "Answer", StudentId = 2, AssignmentId = 1,
            Status = SubmissionStatus.Graded
        });
        db.SaveChanges();

        var service = new SubmissionService(db);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.UpdateAsync(id: 1, studentId: 2, new UpdateSubmissionDto { Answer = "Updated" }));
    }
}
