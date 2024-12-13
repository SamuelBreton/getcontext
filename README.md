# Context: Add Context to Your Events

Context is an application designed to enrich your events with contextual data. It allows you to provide historical context and meaningful insights to your data, helping you better understand user behavior across various dimensions.

---

## Features

- **API Integration**: Add historical and real-time context to your data via a simple REST API.
- **Google Tag Manager Support**: Seamlessly integrate with GTM to capture context for your events.
- **JavaScript Library**: Use the lightweight JavaScript library to integrate directly into your web applications.
- **Enhanced User Understanding**: Unlock new dimensions of user behavior by embedding contextual insights into your analytics and events.

---

## Use Cases

- **Historical Analysis**: Add temporal and contextual information to past events stored in your database.
- **Event Tracking**: Enrich event tracking systems with additional data such as device type, time of day, or holidays.
- **User Behavior Insights**: Gain a deeper understanding of user actions by correlating them with external factors.

---

## Installation

### Using the JavaScript Library

1. Include the library in your project:
   ```html
   <script src="context.js"></script>
   ```

2. Initialize the library:
   ```javascript
   window.contextManager.pushToDataLayer();
   ```

3. Access the context object or push it directly to your data layer for analytics:
   ```javascript
   const context = await window.contextManager.getContext();
   console.log(context);
   ```

---

## API Documentation

### Base URL

```
https://getcontext.onrender.com/v1/api
```

### Endpoints

#### **GET /context**
Retrieve contextual data for a specific timestamp or real-time data.

- **Query Parameters:**
  - `timestamp` (optional): UNIX timestamp (in milliseconds) for historical data. Defaults to the current time.
  - `bypassCache` (optional): Set to `true` to bypass caching and fetch fresh data.

- **Example Request:**
  ```bash
  curl "https://getcontext.onrender.com/v1/api/context?timestamp=1672531200000&bypassCache=true"
  ```

- **Example Response:**
  ```json
  {
    "date": "2024-01-01",
    "time": "10:00:00",
    "timestamp": 1672531200000,
    "year": 2024,
    "month": 1,
    "day": 1,
    "hour": 10,
    "weekOfMonth": 1,
    "dayOfWeek": "Monday",
    "momentOfDay": "morning",
    "season": "winter",
    "isHoliday": "yes",
    "specialEvent": "New Year",
    "timezone": "Europe/Paris",
    "utcOffset": -60,
    "userAgent": "Mozilla/5.0",
    "weekOfYear": 1,
    "quarter": 1
  }
  ```

---

## Integration with Google Tag Manager

1. Add the library to your GTM container.
2. Create a tag to trigger context data capture:
   - Use a custom JavaScript variable to call `contextManager.pushToDataLayer()`.
   - Configure the trigger for the tag (e.g., on page load or event triggers).

---

## How It Works

1. **Capture Context**: Collect contextual data such as holidays, device type, and time-based insights.
2. **Enrich Events**: Append the context to your events as they are logged in your databases or analytics systems.
3. **Analyze User Behavior**: Leverage the enriched data to identify patterns and enhance your understanding of user behavior.

---

## Contributions

We welcome contributions to enhance **Context**! Here's how you can help:
- Report bugs or suggest features via the [issues page](https://github.com/SamuelBreton/getcontext/issues).
- Submit pull requests for new features or bug fixes.
- Improve documentation and examples.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, please contact [breton.samuel@gmail.com](mailto:breton.samuel@gmail.com).
