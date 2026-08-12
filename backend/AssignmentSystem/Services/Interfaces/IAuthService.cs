using AssignmentSystem.DTOs.Auth;

namespace AssignmentSystem.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}
