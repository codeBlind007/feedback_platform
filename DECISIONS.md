
# DECISIONS.md

## 1. Why did you choose this technology stack?

### Backend
I chose Node.js and Express.js because they provide a lightweight and productive environment for building REST APIs. The asynchronous programming model fits well for I/O-heavy applications and allows rapid development.

For authentication, I used JWT stored in HTTP-only cookies. This approach is simple, secure, and commonly used in production applications.

I structured the backend using a Controller-Service architecture to keep business logic separated from HTTP concerns and make the codebase easier to maintain.

### Frontend
I chose Next.js 15 with TypeScript because:

- TypeScript improves maintainability and developer productivity.
- Next.js provides an excellent React developer experience.
- The App Router supports scalable application organization.
- The framework is production-ready and widely adopted.

For UI development I used:

- Tailwind CSS
- Shadcn UI
- Recharts

These tools enabled me to build a clean dashboard quickly while maintaining consistency and responsiveness.

The overall stack was selected to balance development speed, maintainability, and production readiness.

---

## 2. Why did you choose this database?

I chose PostgreSQL hosted on Neon.

Reasons:

- Feedback and users have clear relational relationships.
- PostgreSQL provides strong consistency and ACID guarantees.
- Foreign key constraints help maintain data integrity.
- Aggregation queries required for analytics are efficient.
- Neon provides a managed serverless PostgreSQL solution with minimal operational overhead.

The application benefits from relational modeling more than it would from a NoSQL database.

---

## 3. Why did you structure your application this way?

### Backend

The backend follows a feature-based modular architecture:

```text
modules/
├── auth/
└── feedback/
```

Each module contains:

- Routes
- Controllers
- Services
- Validation

This separation ensures:

- Controllers manage HTTP requests and responses.
- Services contain business logic.
- Validation remains centralized.
- Features remain independent and maintainable.

### Frontend

The frontend follows a scalable structure:

```text
src/
├── app/
├── features/
├── components/
├── services/
├── hooks/
├── providers/
└── types/
```

I used a single frontend application and implemented role-based routing instead of maintaining separate user and admin applications. This reduces duplication while keeping the architecture simple.

---

## 4. What trade-offs did you make due to time constraints?

Due to time constraints, I intentionally postponed several features.

### Notification System

Currently users do not receive notifications when the status of their feedback changes.

In a production system I would implement:

- Email notifications
- In-app notifications
- Status change alerts

### Two-Factor Authentication

The authentication system currently relies on email/password and JWT authentication.

I would add:

- Email OTP verification
- TOTP-based authentication

### Multi-Admin Collaboration

The current implementation assumes a single administrator handling feedback.

In reality, multiple team members may participate in the workflow.

### Testing

I prioritized feature completeness over automated testing.

I would add:

- Unit tests
- Integration tests
- API tests

### Monitoring & Observability

I implemented structured logging but did not implement:

- Monitoring
- Metrics collection
- Distributed tracing

### Rate Limiting

Public endpoints currently do not have advanced rate limiting.

This would be important before production deployment.

---

## 5. What would you improve if you had one more week?

Given one additional week, I would implement:

### Testing

- Unit tests
- Integration tests
- End-to-end tests

### Monitoring

- Prometheus
- Grafana dashboards

### Observability

- OpenTelemetry tracing
- Request correlation
- Error tracking

### Notifications

- Email notifications
- User status update alerts

### Security

- Rate limiting
- Account lockout policies
- Two-factor authentication

### Collaboration

- Multi-admin support
- Response history
- Assignment workflows

### DevOps

- Infrastructure monitoring

---

## 6. What was the most difficult technical challenge you faced?

The most challenging part was designing authentication and role-based access control while keeping the overall architecture simple.

The application supports:

### User Role

- Submit feedback

### Admin Role

- Access analytics
- Search feedback
- Filter feedback
- Respond to feedback

I implemented JWT authentication using HTTP-only cookies and role-based frontend routing to ensure each user only accesses features relevant to their role.

Balancing security, simplicity, and maintainability was the most significant design challenge.

---

## 7. Which AI tools did you use?

I used:

- ChatGPT
- Claude

These tools were primarily used for:

- Brainstorming implementation approaches
- Reviewing architectural decisions
- Frontend planning
- API design validation

---

## 8. Share one instance where AI helped you.

AI significantly accelerated frontend planning.

It helped with:

- Role-based routing architecture
- Authentication provider structure
- Dashboard organization
- Component hierarchy

This reduced setup time and allowed me to spend more effort on implementation and debugging.

---

## 9. Share one instance where you disagreed with AI and why.

AI suggested introducing additional complexity earlier than necessary.

For example, it suggested creating a dedicated feedback response entity.

I chose not to implement a separate table initially because the current requirements only require a single response per feedback.

Adding another table would increase complexity without providing immediate value.

I preferred a simpler solution that satisfies the current requirements while leaving room for future extension.

---

## 10. What would break first if this application suddenly had 100,000 users?

The first bottleneck would likely be the single backend server.

Currently the same server handles:

- Authentication
- Feedback submissions
- Analytics requests
- Administrative actions

At significantly higher traffic levels, backend resources would become constrained before other parts of the system.

My scaling strategy would be:

### Application Layer

- Multiple backend instances
- Load balancer
- Horizontal scaling

### Service Separation

Separate services for:

- User-facing APIs
- Admin/Internal APIs

### Database Layer

- Additional indexing
- Query optimization
- Read replicas if necessary

### Caching

- Analytics caching
- Frequently requested data caching

### Infrastructure

- Monitoring
- Autoscaling
- Alerting

This architecture would significantly increase system capacity.

---

## 11. What is one thing in this assignment that you would improve, change, or challenge?

The current implementation assumes a single administrator workflow.

In a real organization, customer feedback is often handled by multiple people across different teams.

Given more time, I would redesign this area using a dedicated:

```text
feedback_responses
```

table.

Benefits:

- Multiple responses per feedback
- Response history
- Team collaboration
- Escalation workflows
- Better auditability
- Department ownership

This would better represent how customer support and feedback systems operate in real-world organizations.

---

# Production Readiness Considerations

## Implemented

### Environment Variables

Sensitive configuration is stored using environment variables.

Examples:

- Database URL
- JWT Secret

### Validation

Input validation is implemented before processing requests.

### Error Handling

Centralized error handling patterns are used throughout the application.

### Authentication

JWT authentication using HTTP-only cookies.

### Authorization

Role-based access control for:

- Users
- Administrators

### Health Check Endpoint

Health endpoint included for service availability checks.

### Structured Logging

Implemented using Winston.

Logs include:

- Authentication events
- Feedback operations
- Request logging
- Error logging

### Modular Architecture

Controller-Service separation improves maintainability and testability.

---

## Planned Next

### Unit Tests

Service and controller testing.

### Monitoring

Prometheus and Grafana.

### Observability

OpenTelemetry tracing and metrics.

### Rate Limiting

Protection against abuse of public endpoints.


---

# Bonus Points Status

## Implemented

- Authentication
- CI/CD

## Planned

- Unit Tests
- Monitoring
- Observability
- Rate Limiting

---

# Final Notes

The primary goal of this assignment was to build a complete and maintainable feedback platform while demonstrating engineering decision-making.

Given the available time, I prioritized:

- Authentication
- Authorization
- Analytics
- Clean architecture
- Validation
- Logging
- Production-oriented design
- CI/CD

while intentionally deferring more advanced operational features such as monitoring, observability, testing, and large-scale collaboration workflows.
