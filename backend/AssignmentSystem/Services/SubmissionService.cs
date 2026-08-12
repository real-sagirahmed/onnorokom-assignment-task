using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Submissions;
using AssignmentSystem.Models;
using AssignmentSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Services;

public class SubmissionService(AppDbContext db) : ISubmissionService
{
    public async Task<IEnumerable<SubmissionDto>> GetByAssignmentAsync(int assignmentId)
    {
        return await db.Submissions
            .Include(s => s.Student)
            .Include(s => s.Assignment)
            .Where(s => s.AssignmentId == assignmentId)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<IEnumerable<SubmissionDto>> GetByStudentAsync(int studentId)
    {
        return await db.Submissions
            .Include(s => s.Student)
            .Include(s => s.Assignment)
            .Where(s => s.StudentId == studentId)
            .Select(s => MapToDto(s))
            .ToListAsync();
    }

    public async Task<SubmissionDto?> GetByIdAsync(int id)
    {
        var s = await db.Submissions
            .Include(s => s.Student)
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id);
        return s is null ? null : MapToDto(s);
    }

    public async Task<SubmissionDto> CreateAsync(int studentId, CreateSubmissionDto dto)
    {
        var assignment = await db.Assignments.FindAsync(dto.AssignmentId)
            ?? throw new KeyNotFoundException("Assignment not found.");

        if (assignment.Status != AssignmentStatus.Published)
            throw new InvalidOperationException("Assignment is not published.");

        if (DateTime.UtcNow > assignment.Deadline)
            throw new InvalidOperationException("Submission deadline has passed.");

        var existing = await db.Submissions
            .FirstOrDefaultAsync(s => s.StudentId == studentId && s.AssignmentId == dto.AssignmentId);
        if (existing is not null)
            throw new InvalidOperationException("You have already submitted this assignment.");

        var submission = new Submission
        {
            Answer = dto.Answer,
            StudentId = studentId,
            AssignmentId = dto.AssignmentId,
            Status = DateTime.UtcNow > assignment.Deadline ? SubmissionStatus.Late : SubmissionStatus.Submitted
        };

        db.Submissions.Add(submission);
        await db.SaveChangesAsync();

        return (await GetByIdAsync(submission.Id))!;
    }

    public async Task<SubmissionDto?> UpdateAsync(int id, int studentId, UpdateSubmissionDto dto)
    {
        var submission = await db.Submissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null) return null;
        if (submission.StudentId != studentId)
            throw new UnauthorizedAccessException("You can only update your own submissions.");

        if (submission.Status == SubmissionStatus.Graded)
            throw new InvalidOperationException("Graded submissions cannot be updated.");

        if (DateTime.UtcNow > submission.Assignment.Deadline)
            throw new InvalidOperationException("Deadline has passed. Submission cannot be updated.");

        submission.Answer = dto.Answer;
        submission.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<SubmissionDto?> GradeAsync(int id, int teacherId, GradeSubmissionDto dto)
    {
        var submission = await db.Submissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null) return null;

        // Validate teacher owns the assignment
        if (submission.Assignment.TeacherId != teacherId)
            throw new UnauthorizedAccessException("You can only grade submissions for your own assignments.");

        if (dto.MarksAwarded > submission.Assignment.MaxMarks)
            throw new InvalidOperationException($"Marks cannot exceed MaxMarks ({submission.Assignment.MaxMarks}).");

        submission.MarksAwarded = dto.MarksAwarded;
        submission.Feedback = dto.Feedback;
        submission.Status = dto.Status;
        submission.GradedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    private static SubmissionDto MapToDto(Submission s) => new()
    {
        Id = s.Id,
        Answer = s.Answer,
        Status = s.Status.ToString(),
        MarksAwarded = s.MarksAwarded,
        Feedback = s.Feedback,
        SubmittedAt = s.SubmittedAt,
        UpdatedAt = s.UpdatedAt,
        GradedAt = s.GradedAt,
        StudentId = s.StudentId,
        StudentName = s.Student?.Name ?? string.Empty,
        AssignmentId = s.AssignmentId,
        AssignmentTitle = s.Assignment?.Title ?? string.Empty,
        MaxMarks = s.Assignment?.MaxMarks ?? 0
    };
}
