using System.Security.Claims;
using AssignmentSystem.DTOs.Submissions;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController(ISubmissionService submissionService) : ControllerBase
{
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Get submissions. Teacher gets by assignment; Student gets their own.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? assignmentId, [FromQuery] int? studentId)
    {
        if (assignmentId.HasValue)
            return Ok(await submissionService.GetByAssignmentAsync(assignmentId.Value));

        if (studentId.HasValue)
            return Ok(await submissionService.GetByStudentAsync(studentId.Value));

        return Ok(await submissionService.GetByStudentAsync(CurrentUserId));
    }

    /// <summary>Get submission by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var submission = await submissionService.GetByIdAsync(id);
        return submission is null ? NotFound() : Ok(submission);
    }

    /// <summary>Submit an assignment. Student only.</summary>
    [HttpPost]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionDto dto)
    {
        try
        {
            var submission = await submissionService.CreateAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetById), new { id = submission.Id }, submission);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>Update own submission before deadline. Student only.</summary>
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubmissionDto dto)
    {
        try
        {
            var submission = await submissionService.UpdateAsync(id, CurrentUserId, dto);
            return submission is null ? NotFound() : Ok(submission);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>Grade a submission. Teacher only.</summary>
    [HttpPatch("{id:int}/grade")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Grade(int id, [FromBody] GradeSubmissionDto dto)
    {
        try
        {
            var submission = await submissionService.GradeAsync(id, CurrentUserId, dto);
            return submission is null ? NotFound() : Ok(submission);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
