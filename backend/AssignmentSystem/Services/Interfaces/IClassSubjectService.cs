using AssignmentSystem.Models;

namespace AssignmentSystem.Services.Interfaces;

public interface IClassService
{
    Task<IEnumerable<Class>> GetAllAsync();
    Task<Class?> GetByIdAsync(int id);
    Task<Class> CreateAsync(string name, string? description);
    Task<Class?> UpdateAsync(int id, string? name, string? description);
    Task<bool> DeleteAsync(int id);
}

public interface ISubjectService
{
    Task<IEnumerable<Subject>> GetAllAsync();
    Task<Subject?> GetByIdAsync(int id);
    Task<Subject> CreateAsync(string name, string? code, string? description);
    Task<Subject?> UpdateAsync(int id, string? name, string? code, string? description);
    Task<bool> DeleteAsync(int id);
}
