using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Models;

namespace AssignmentSystem.DTOs.Submissions;

public class GradeSubmissionDto
{
    [Required, Range(0, 100)]
    public int MarksAwarded { get; set; }

    [MaxLength(1000)]
    public string? Feedback { get; set; }

    public SubmissionStatus Status { get; set; } = SubmissionStatus.Graded;
}
