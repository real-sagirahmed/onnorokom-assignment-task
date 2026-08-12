using AssignmentSystem.DTOs.Submissions;

namespace AssignmentSystem.Services.Interfaces;

public interface ISubmissionService
{
    Task<IEnumerable<SubmissionDto>> GetByAssignmentAsync(int assignmentId);
    Task<IEnumerable<SubmissionDto>> GetByStudentAsync(int studentId);
    Task<SubmissionDto?> GetByIdAsync(int id);
    Task<SubmissionDto> CreateAsync(int studentId, CreateSubmissionDto dto);
    Task<SubmissionDto?> UpdateAsync(int id, int studentId, UpdateSubmissionDto dto);
    Task<SubmissionDto?> GradeAsync(int id, int teacherId, GradeSubmissionDto dto);
}
