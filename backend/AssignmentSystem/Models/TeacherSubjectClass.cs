namespace AssignmentSystem.Models;

/// <summary>
/// Junction table: links a Teacher to a Subject in a specific Class.
/// Admin assigns teachers to subjects within classes using this entity.
/// </summary>
public class TeacherSubjectClass
{
    public int Id { get; set; }

    public int TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
