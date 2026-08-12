using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Models;

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty; // Admin, Teacher, Student

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Student: belongs to a class
    public int? ClassId { get; set; }
    public Class? Class { get; set; }

    // Teacher: can teach multiple subjects in multiple classes
    public ICollection<TeacherSubjectClass> TeacherSubjectClasses { get; set; } = [];

    // Submissions (if student)
    public ICollection<Submission> Submissions { get; set; } = [];

    // Assignments created (if teacher)
    public ICollection<Assignment> CreatedAssignments { get; set; } = [];
}
