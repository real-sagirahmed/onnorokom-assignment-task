using AssignmentSystem.DTOs.Users;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController(IUserService userService) : ControllerBase
{
    /// <summary>Get all users. Admin only.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await userService.GetAllUsersAsync());

    /// <summary>Get user by ID. Admin only.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await userService.GetUserByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>Create a new user. Admin only.</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var user = await userService.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    /// <summary>Update a user. Admin only.</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await userService.UpdateUserAsync(id, dto);
        return user is null ? NotFound() : Ok(user);
    }

    /// <summary>Soft-delete a user. Admin only.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await userService.DeleteUserAsync(id);
        return result ? NoContent() : NotFound();
    }
}
