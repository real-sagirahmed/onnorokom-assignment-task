using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Assignments;
using AssignmentSystem.Models;
using AssignmentSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Services;

public class AssignmentService(AppDbContext db) : IAssignmentService
{
    public async Task<IEnumerable<AssignmentDto>> GetAllAsync()
    {
        return await db.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Submissions)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<AssignmentDto>> GetByTeacherAsync(int teacherId)
    {
        return await db.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Submissions)
            .Where(a => a.TeacherId == teacherId)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<IEnumerable<AssignmentDto>> GetByClassAsync(int classId)
    {
        return await db.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Submissions)
            .Where(a => a.ClassId == classId && a.Status == AssignmentStatus.Published)
            .Select(a => MapToDto(a))
            .ToListAsync();
    }

    public async Task<AssignmentDto?> GetByIdAsync(int id)
    {
        var a = await db.Assignments
            .Include(a => a.Teacher)
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Submissions)
            .FirstOrDefaultAsync(a => a.Id == id);
        return a is null ? null : MapToDto(a);
    }

    public async Task<AssignmentDto> CreateAsync(int teacherId, CreateAssignmentDto dto)
    {
        // Validate teacher is assigned to this subject in this class
        var isAssigned = await db.TeacherSubjectClasses.AnyAsync(tsc =>
            tsc.TeacherId == teacherId &&
            tsc.ClassId == dto.ClassId &&
            tsc.SubjectId == dto.SubjectId);

        if (!isAssigned)
            throw new UnauthorizedAccessException("Teacher is not assigned to this subject/class.");

        var assignment = new Assignment
        {
            Title = dto.Title,
            Description = dto.Description,
            Deadline = dto.Deadline,
            MaxMarks = dto.MaxMarks,
            Status = dto.Status,
            TeacherId = teacherId,
            ClassId = dto.ClassId,
            SubjectId = dto.SubjectId
        };

        db.Assignments.Add(assignment);
        await db.SaveChangesAsync();

        return (await GetByIdAsync(assignment.Id))!;
    }

    public async Task<AssignmentDto?> UpdateAsync(int id, int teacherId, UpdateAssignmentDto dto)
    {
        var assignment = await db.Assignments.FindAsync(id);
        if (assignment is null) return null;
        if (assignment.TeacherId != teacherId)
            throw new UnauthorizedAccessException("You can only update your own assignments.");

        if (dto.Title is not null) assignment.Title = dto.Title;
        if (dto.Description is not null) assignment.Description = dto.Description;
        if (dto.Deadline.HasValue) assignment.Deadline = dto.Deadline.Value;
        if (dto.MaxMarks.HasValue) assignment.MaxMarks = dto.MaxMarks.Value;
        if (dto.Status.HasValue) assignment.Status = dto.Status.Value;
        assignment.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id, int teacherId)
    {
        var assignment = await db.Assignments.FindAsync(id);
        if (assignment is null) return false;
        if (assignment.TeacherId != teacherId)
            throw new UnauthorizedAccessException("You can only delete your own assignments.");

        db.Assignments.Remove(assignment);
        await db.SaveChangesAsync();
        return true;
    }

    private static AssignmentDto MapToDto(Assignment a) => new()
    {
        Id = a.Id,
        Title = a.Title,
        Description = a.Description,
        Deadline = a.Deadline,
        MaxMarks = a.MaxMarks,
        Status = a.Status.ToString(),
        CreatedAt = a.CreatedAt,
        UpdatedAt = a.UpdatedAt,
        TeacherId = a.TeacherId,
        TeacherName = a.Teacher?.Name ?? string.Empty,
        ClassId = a.ClassId,
        ClassName = a.Class?.Name ?? string.Empty,
        SubjectId = a.SubjectId,
        SubjectName = a.Subject?.Name ?? string.Empty,
        SubmissionsCount = a.Submissions?.Count ?? 0
    };
}
