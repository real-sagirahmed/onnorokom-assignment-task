using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Models;

namespace AssignmentSystem.DTOs.Assignments;

public class CreateAssignmentDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Deadline { get; set; }

    [Range(1, 100)]
    public int MaxMarks { get; set; } = 100;

    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;

    [Required]
    public int ClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }
}

public class UpdateAssignmentDto
{
    [MaxLength(200)]
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? Deadline { get; set; }

    [Range(1, 100)]
    public int? MaxMarks { get; set; }
    public AssignmentStatus? Status { get; set; }
}
