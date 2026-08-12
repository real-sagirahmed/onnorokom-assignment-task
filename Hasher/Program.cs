using System;
class Program {
    static void Main() {
        Console.WriteLine("Admin: " + BCrypt.Net.BCrypt.HashPassword("Admin@123"));
        Console.WriteLine("Teacher: " + BCrypt.Net.BCrypt.HashPassword("Teacher@123"));
        Console.WriteLine("Student: " + BCrypt.Net.BCrypt.HashPassword("Student@123"));
    }
}
