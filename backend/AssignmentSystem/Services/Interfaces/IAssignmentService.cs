using AssignmentSystem.DTOs.Assignments;

namespace AssignmentSystem.Services.Interfaces;

public interface IAssignmentService
{
    Task<IEnumerable<AssignmentDto>> GetAllAsync();
    Task<IEnumerable<AssignmentDto>> GetByTeacherAsync(int teacherId);
    Task<IEnumerable<AssignmentDto>> GetByClassAsync(int classId);
    Task<AssignmentDto?> GetByIdAsync(int id);
    Task<AssignmentDto> CreateAsync(int teacherId, CreateAssignmentDto dto);
    Task<AssignmentDto?> UpdateAsync(int id, int teacherId, UpdateAssignmentDto dto);
    Task<bool> DeleteAsync(int id, int teacherId);
}
