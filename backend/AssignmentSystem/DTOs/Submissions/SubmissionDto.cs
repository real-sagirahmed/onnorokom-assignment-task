using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Models;

namespace AssignmentSystem.DTOs.Submissions;

public class CreateSubmissionDto
{
    [Required]
    public string Answer { get; set; } = string.Empty;

    [Required]
    public int AssignmentId { get; set; }
}

public class UpdateSubmissionDto
{
    [Required]
    public string Answer { get; set; } = string.Empty;
}

public class SubmissionDto
{
    public int Id { get; set; }
    public string Answer { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int? MarksAwarded { get; set; }
    public string? Feedback { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? GradedAt { get; set; }

    // Student info
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;

    // Assignment info
    public int AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;
    public int MaxMarks { get; set; }
}
