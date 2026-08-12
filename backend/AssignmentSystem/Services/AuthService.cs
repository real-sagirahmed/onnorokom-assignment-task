using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Auth;
using AssignmentSystem.Services.Interfaces;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AssignmentSystem.Services;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        var expiryDays = int.Parse(config["Jwt:ExpiryDays"] ?? "7");
        var expiresAt = DateTime.UtcNow.AddDays(expiryDays);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return new LoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Role = user.Role,
            Name = user.Name,
            Email = user.Email,
            UserId = user.Id,
            ExpiresAt = expiresAt
        };
    }
}
