using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Models;

public class Submission
{
    public int Id { get; set; }

    [Required]
    public string Answer { get; set; } = string.Empty;

    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

    public int? MarksAwarded { get; set; }

    [MaxLength(1000)]
    public string? Feedback { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? GradedAt { get; set; }

    // Relations
    public int StudentId { get; set; }
    public User Student { get; set; } = null!;

    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;
}

public enum SubmissionStatus
{
    Submitted = 0,
    UnderReview = 1,
    Graded = 2,
    Late = 3
}
