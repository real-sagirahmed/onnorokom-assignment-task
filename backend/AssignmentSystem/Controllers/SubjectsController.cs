using AssignmentSystem.Data;
using AssignmentSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SubjectsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Subjects.Where(s => s.IsActive).ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subject = await db.Subjects.FindAsync(id);
        return subject is null ? NotFound() : Ok(subject);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
    {
        var subject = new Subject { Name = dto.Name, Code = dto.Code, Description = dto.Description };
        db.Subjects.Add(subject);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = subject.Id }, subject);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateSubjectDto dto)
    {
        var subject = await db.Subjects.FindAsync(id);
        if (subject is null) return NotFound();
        subject.Name = dto.Name;
        subject.Code = dto.Code;
        subject.Description = dto.Description;
        await db.SaveChangesAsync();
        return Ok(subject);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var subject = await db.Subjects.FindAsync(id);
        if (subject is null) return NotFound();
        subject.IsActive = false;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Assign a teacher to a subject in a class. Admin only.</summary>
    [HttpPost("assign-teacher")]
    public async Task<IActionResult> AssignTeacher([FromBody] AssignTeacherDto dto)
    {
        var exists = await db.TeacherSubjectClasses.AnyAsync(tsc =>
            tsc.TeacherId == dto.TeacherId &&
            tsc.SubjectId == dto.SubjectId &&
            tsc.ClassId == dto.ClassId);

        if (exists)
            return Conflict(new { message = "Teacher already assigned to this subject/class." });

        db.TeacherSubjectClasses.Add(new TeacherSubjectClass
        {
            TeacherId = dto.TeacherId,
            SubjectId = dto.SubjectId,
            ClassId = dto.ClassId
        });

        await db.SaveChangesAsync();
        return Ok(new { message = "Teacher assigned successfully." });
    }
}

public record CreateSubjectDto(string Name, string? Code, string? Description);
public record AssignTeacherDto(int TeacherId, int SubjectId, int ClassId);
