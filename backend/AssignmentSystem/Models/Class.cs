using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Models;

public class Class
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Class 10", "CSE-A"

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Students in this class
    public ICollection<User> Students { get; set; } = [];

    // Subject-teacher mappings for this class
    public ICollection<TeacherSubjectClass> TeacherSubjectClasses { get; set; } = [];

    // Assignments for this class
    public ICollection<Assignment> Assignments { get; set; } = [];
}
