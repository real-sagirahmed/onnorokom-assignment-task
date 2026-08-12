using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Models;

public class Assignment
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    [Range(1, 100)]
    public int MaxMarks { get; set; } = 100;

    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Relations
    public int TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    public ICollection<Submission> Submissions { get; set; } = [];
}

public enum AssignmentStatus
{
    Draft = 0,
    Published = 1,
    Closed = 2
}
