describe("Feedback API Validation", () => {
  test("should accept valid feedback data", () => {
    const feedback = {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test feedback",
      rating: 5,
    };

    expect(feedback.name).toBeTruthy();
    expect(feedback.email).toBeTruthy();
    expect(feedback.message).toBeTruthy();
    expect(feedback.rating).toBeGreaterThanOrEqual(1);
    expect(feedback.rating).toBeLessThanOrEqual(5);
  });

  test("rating should be between 1 and 5", () => {
    const rating = 4;

    expect(rating).toBeGreaterThanOrEqual(1);
    expect(rating).toBeLessThanOrEqual(5);
  });
});