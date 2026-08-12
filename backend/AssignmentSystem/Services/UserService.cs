using AssignmentSystem.Data;
using AssignmentSystem.DTOs.Users;
using AssignmentSystem.Models;
using AssignmentSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Services;

public class UserService(AppDbContext db) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        return await db.Users
            .Include(u => u.Class)
            .Select(u => MapToDto(u))
            .ToListAsync();
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await db.Users.Include(u => u.Class).FirstOrDefaultAsync(u => u.Id == id);
        return user is null ? null : MapToDto(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role,
            ClassId = dto.ClassId
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto dto)
    {
        var user = await db.Users.Include(u => u.Class).FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return null;

        if (dto.Name is not null) user.Name = dto.Name;
        if (dto.IsActive is not null) user.IsActive = dto.IsActive.Value;
        if (dto.ClassId is not null) user.ClassId = dto.ClassId;

        await db.SaveChangesAsync();
        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return false;

        user.IsActive = false; // Soft delete
        await db.SaveChangesAsync();
        return true;
    }

    private static UserDto MapToDto(User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.Role,
        IsActive = u.IsActive,
        CreatedAt = u.CreatedAt,
        ClassId = u.ClassId,
        ClassName = u.Class?.Name
    };
}
