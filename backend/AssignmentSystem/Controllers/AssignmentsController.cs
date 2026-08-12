using System.Security.Claims;
using AssignmentSystem.DTOs.Assignments;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController(IAssignmentService assignmentService) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private string CurrentRole =>
        User.FindFirstValue(ClaimTypes.Role)!;

    /// <summary>
    /// Get assignments. Admin gets all; Teacher gets their own; Student gets their class assignments.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? classId, [FromQuery] int? teacherId)
    {
        if (classId.HasValue)
            return Ok(await assignmentService.GetByClassAsync(classId.Value));

        if (teacherId.HasValue && CurrentRole == "Admin")
            return Ok(await assignmentService.GetByTeacherAsync(teacherId.Value));

        if (CurrentRole == "Teacher")
            return Ok(await assignmentService.GetByTeacherAsync(CurrentUserId));

        return Ok(await assignmentService.GetAllAsync());
    }

    /// <summary>Get assignment by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var assignment = await assignmentService.GetByIdAsync(id);
        return assignment is null ? NotFound() : Ok(assignment);
    }

    /// <summary>Create an assignment. Teacher only.</summary>
    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentDto dto)
    {
        try
        {
            var assignment = await assignmentService.CreateAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, assignment);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>Update an assignment. Teacher (own) only.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAssignmentDto dto)
    {
        try
        {
            var assignment = await assignmentService.UpdateAsync(id, CurrentUserId, dto);
            return assignment is null ? NotFound() : Ok(assignment);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>Delete an assignment. Teacher (own) only.</summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await assignmentService.DeleteAsync(id, CurrentUserId);
            return result ? NoContent() : NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }
}
