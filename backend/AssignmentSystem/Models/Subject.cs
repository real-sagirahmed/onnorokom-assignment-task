using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Models;

public class Subject
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Mathematics", "English"

    [MaxLength(20)]
    public string? Code { get; set; } // e.g. "MATH101"

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Teacher-class mappings for this subject
    public ICollection<TeacherSubjectClass> TeacherSubjectClasses { get; set; } = [];

    // Assignments for this subject
    public ICollection<Assignment> Assignments { get; set; } = [];
}
