using AssignmentSystem.DTOs.Auth;
using AssignmentSystem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Login with email and password. Returns a JWT token.</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await authService.LoginAsync(dto);
        if (result is null)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(result);
    }
}
