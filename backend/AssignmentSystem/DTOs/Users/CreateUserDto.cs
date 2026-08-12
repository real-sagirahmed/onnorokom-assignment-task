using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.DTOs.Users;

public class CreateUserDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
        ErrorMessage = "Password must have uppercase, lowercase and a number.")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Admin|Teacher|Student)$", ErrorMessage = "Role must be Admin, Teacher, or Student.")]
    public string Role { get; set; } = string.Empty;

    // Only for students
    public int? ClassId { get; set; }
}
