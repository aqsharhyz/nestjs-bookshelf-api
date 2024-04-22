**Bookshelf API Project**

This repository contains a Bookshelf API built using NestJS, MySQL, and Prisma. It provides a RESTful interface to manage books, authors, and categories within a virtual bookshelf.

### Prerequisites

- Node.js installed on your machine.
- MySQL database server installed and running.
- Prisma CLI installed globally (`npm install -g prisma`).

### Getting Started

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Configure your MySQL database connection in the `ormconfig.json` file.
5. Run database migrations using `npm run prisma:migrate`.
6. Seed the database with initial data using `npm run prisma:seed`.
7. Start the application using `npm run start:dev`.

### Usage

- The API endpoints can be accessed at `http://localhost:3000`.
- Use a tool like Postman or curl to interact with the endpoints.
- Refer to the OpenAPI documentation at `http://localhost:3000/api` for detailed API specifications.

### Available Endpoints

- **GET /books**: Retrieve all books.
- **GET /books/:id**: Retrieve a specific book by ID.
- **POST /books**: Create a new book.
- **PUT /books/:id**: Update an existing book.
- **DELETE /books/:id**: Delete a book.

Similar endpoints are available for authors and categories.

### Development

- Run `npm run start:dev` to start the server in development mode with hot-reloading enabled.
- Write tests in the `test` directory using Jest and Supertest.
- Run tests using `npm test`.

### Deployment

- Configure environment variables for production settings.
- Build the application using `npm run build`.
- Deploy the built application to your preferred hosting platform.

### Contributing

Contributions are welcome! Please follow the [contributing guidelines](CONTRIBUTING.md).

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Acknowledgments

Special thanks to the NestJS, MySQL, and Prisma communities for their fantastic tools and resources.

### Contact

For any inquiries or support, please contact [maintainer_email@example.com](mailto:maintainer_email@example.com).

Happy coding! 🚀
