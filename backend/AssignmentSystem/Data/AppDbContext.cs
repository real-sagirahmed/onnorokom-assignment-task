using AssignmentSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<TeacherSubjectClass> TeacherSubjectClasses { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Submission> Submissions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Student belongs to one class
        modelBuilder.Entity<User>()
            .HasOne(u => u.Class)
            .WithMany(c => c.Students)
            .HasForeignKey(u => u.ClassId)
            .OnDelete(DeleteBehavior.SetNull);

        // Teacher-Subject-Class junction
        modelBuilder.Entity<TeacherSubjectClass>()
            .HasOne(tsc => tsc.Teacher)
            .WithMany(u => u.TeacherSubjectClasses)
            .HasForeignKey(tsc => tsc.TeacherId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TeacherSubjectClass>()
            .HasOne(tsc => tsc.Subject)
            .WithMany(s => s.TeacherSubjectClasses)
            .HasForeignKey(tsc => tsc.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TeacherSubjectClass>()
            .HasOne(tsc => tsc.Class)
            .WithMany(c => c.TeacherSubjectClasses)
            .HasForeignKey(tsc => tsc.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        // Assignment → Teacher (restrict delete if assignments exist)
        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Teacher)
            .WithMany(u => u.CreatedAssignments)
            .HasForeignKey(a => a.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Assignment → Class
        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Class)
            .WithMany(c => c.Assignments)
            .HasForeignKey(a => a.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        // Assignment → Subject
        modelBuilder.Entity<Assignment>()
            .HasOne(a => a.Subject)
            .WithMany(s => s.Assignments)
            .HasForeignKey(a => a.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        // Submission → Student
        modelBuilder.Entity<Submission>()
            .HasOne(s => s.Student)
            .WithMany(u => u.Submissions)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // One submission per student per assignment
        modelBuilder.Entity<Submission>()
            .HasIndex(s => new { s.StudentId, s.AssignmentId })
            .IsUnique();

        // Seed data
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Seeded password hashes are for "Admin@123", "Teacher@123", "Student@123"
        // These are BCrypt hashes — regenerate with BCrypt.Net in production

        modelBuilder.Entity<Class>().HasData(
            new Class { Id = 1, Name = "Class 10-A", Description = "Science Group", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Class { Id = 2, Name = "Class 10-B", Description = "Commerce Group", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<Subject>().HasData(
            new Subject { Id = 1, Name = "Mathematics", Code = "MATH101", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Subject { Id = 2, Name = "English", Code = "ENG101", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1, Name = "Admin User", Email = "admin@school.com",
                PasswordHash = "$2a$11$5msTrkEd2puZucdMK6chZu3obJEmns7TB2nyMjwRU.0s0bRSJ3gkO", // Admin@123
                Role = "Admin", IsActive = true, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = 2, Name = "Teacher User", Email = "teacher@school.com",
                PasswordHash = "$2a$11$rNhHbztlwTFg7qGch19lDOLSb/qm5Wc5SNRNo5lyCXd57tSJSgHcK", // Teacher@123
                Role = "Teacher", IsActive = true, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new User
            {
                Id = 3, Name = "Student User", Email = "student@school.com",
                PasswordHash = "$2a$11$8rIjNkK7hq7vWDa31G0lEOz7eetXn3Dn8TvE1nvcOViGUFNd.YQBm", // Student@123
                Role = "Student", IsActive = true, ClassId = 1, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
