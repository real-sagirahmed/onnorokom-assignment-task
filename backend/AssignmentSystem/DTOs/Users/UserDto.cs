namespace AssignmentSystem.DTOs.Users;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
}

public class UpdateUserDto
{
    public string? Name { get; set; }
    public bool? IsActive { get; set; }
    public int? ClassId { get; set; }
}
