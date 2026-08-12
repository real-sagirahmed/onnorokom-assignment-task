using System.Net;
using System.Text.Json;

namespace AssignmentSystem.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized access attempt.");
            await WriteErrorResponse(context, HttpStatusCode.Forbidden, ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Resource not found.");
            await WriteErrorResponse(context, HttpStatusCode.NotFound, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation.");
            await WriteErrorResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception.");
            await WriteErrorResponse(context, HttpStatusCode.InternalServerError,
                "An unexpected error occurred. Please try again.");
        }
    }

    private static async Task WriteErrorResponse(HttpContext context, HttpStatusCode code, string message)
    {
        context.Response.StatusCode = (int)code;
        context.Response.ContentType = "application/json";

        var response = JsonSerializer.Serialize(new
        {
            status = (int)code,
            error = code.ToString(),
            message
        });

        await context.Response.WriteAsync(response);
    }
}
