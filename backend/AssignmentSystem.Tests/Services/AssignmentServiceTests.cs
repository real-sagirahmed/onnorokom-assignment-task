using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Assignments;
using AssignmentSystem.Models;
using AssignmentSystem.Services;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Tests.Services;

public class AssignmentServiceTests
{
    private AppDbContext CreateInMemoryDb(string dbName)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;
        return new AppDbContext(options);
    }

    private static void SeedBasicData(AppDbContext db)
    {
        var cls = new Class { Id = 1, Name = "Class 10-A" };
        var subject = new Subject { Id = 1, Name = "Math" };
        var teacher = new User
        {
            Id = 10, Name = "Test Teacher", Email = "t@test.com",
            PasswordHash = "hash", Role = "Teacher"
        };
        var tsc = new TeacherSubjectClass
        {
            Id = 1, TeacherId = 10, SubjectId = 1, ClassId = 1
        };

        db.Classes.Add(cls);
        db.Subjects.Add(subject);
        db.Users.Add(teacher);
        db.TeacherSubjectClasses.Add(tsc);
        db.SaveChanges();
    }

    [Fact]
    public async Task CreateAsync_ValidTeacherAssignment_ReturnsAssignmentDto()
    {
        // Arrange
        var db = CreateInMemoryDb("create_valid");
        SeedBasicData(db);
        var service = new AssignmentService(db);

        var dto = new CreateAssignmentDto
        {
            Title = "Test Assignment",
            Description = "Test Description",
            Deadline = DateTime.UtcNow.AddDays(7),
            MaxMarks = 50,
            ClassId = 1,
            SubjectId = 1,
            Status = AssignmentStatus.Published
        };

        // Act
        var result = await service.CreateAsync(teacherId: 10, dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Assignment", result.Title);
        Assert.Equal("Published", result.Status);
    }

    [Fact]
    public async Task CreateAsync_TeacherNotAssignedToClass_ThrowsUnauthorized()
    {
        // Arrange
        var db = CreateInMemoryDb("create_unauthorized");
        SeedBasicData(db);
        var service = new AssignmentService(db);

        var dto = new CreateAssignmentDto
        {
            Title = "Bad Assignment",
            Description = "Desc",
            Deadline = DateTime.UtcNow.AddDays(7),
            MaxMarks = 50,
            ClassId = 99, // teacher NOT assigned to class 99
            SubjectId = 1
        };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.CreateAsync(teacherId: 10, dto));
    }

    [Fact]
    public async Task UpdateAsync_OtherTeacherAttempt_ThrowsUnauthorized()
    {
        // Arrange
        var db = CreateInMemoryDb("update_unauthorized");
        SeedBasicData(db);
        db.Assignments.Add(new Assignment
        {
            Id = 1, Title = "A", Description = "D",
            Deadline = DateTime.UtcNow.AddDays(5), MaxMarks = 100,
            TeacherId = 10, ClassId = 1, SubjectId = 1
        });
        db.SaveChanges();

        var service = new AssignmentService(db);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.UpdateAsync(id: 1, teacherId: 99, new UpdateAssignmentDto { Title = "Hack" }));
    }

    [Fact]
    public async Task GetByTeacherAsync_ReturnsOnlyTeachersAssignments()
    {
        // Arrange
        var db = CreateInMemoryDb("get_by_teacher");
        SeedBasicData(db);
        db.Assignments.AddRange(
            new Assignment
            {
                Title = "Mine", Description = "D", Deadline = DateTime.UtcNow.AddDays(5),
                MaxMarks = 100, TeacherId = 10, ClassId = 1, SubjectId = 1
            },
            new Assignment
            {
                Title = "Not Mine", Description = "D", Deadline = DateTime.UtcNow.AddDays(5),
                MaxMarks = 100, TeacherId = 99, ClassId = 1, SubjectId = 1
            }
        );
        db.SaveChanges();

        var service = new AssignmentService(db);

        // Act
        var results = (await service.GetByTeacherAsync(10)).ToList();

        // Assert
        Assert.Single(results);
        Assert.Equal("Mine", results[0].Title);
    }

    [Fact]
    public async Task GetByClassAsync_ReturnsOnlyPublishedAssignments()
    {
        // Arrange
        var db = CreateInMemoryDb("get_by_class_published");
        SeedBasicData(db);
        db.Assignments.AddRange(
            new Assignment
            {
                Title = "Published", Description = "D", Deadline = DateTime.UtcNow.AddDays(5),
                MaxMarks = 100, TeacherId = 10, ClassId = 1, SubjectId = 1,
                Status = AssignmentStatus.Published
            },
            new Assignment
            {
                Title = "Draft", Description = "D", Deadline = DateTime.UtcNow.AddDays(5),
                MaxMarks = 100, TeacherId = 10, ClassId = 1, SubjectId = 1,
                Status = AssignmentStatus.Draft
            }
        );
        db.SaveChanges();

        var service = new AssignmentService(db);

        // Act
        var results = (await service.GetByClassAsync(1)).ToList();

        // Assert
        Assert.Single(results);
        Assert.Equal("Published", results[0].Title);
    }
}
