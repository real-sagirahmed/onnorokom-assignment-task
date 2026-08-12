using AssignmentSystem.Data;
using AssignmentSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ClassesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll() =>
        Ok(await db.Classes.Where(c => c.IsActive).ToListAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cls = await db.Classes.FindAsync(id);
        return cls is null ? NotFound() : Ok(cls);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateClassDto dto)
    {
        var cls = new Class { Name = dto.Name, Description = dto.Description };
        db.Classes.Add(cls);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = cls.Id }, cls);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateClassDto dto)
    {
        var cls = await db.Classes.FindAsync(id);
        if (cls is null) return NotFound();
        cls.Name = dto.Name;
        cls.Description = dto.Description;
        await db.SaveChangesAsync();
        return Ok(cls);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cls = await db.Classes.FindAsync(id);
        if (cls is null) return NotFound();
        cls.IsActive = false;
        await db.SaveChangesAsync();
        return NoContent();
    }
}

public record CreateClassDto(string Name, string? Description);
