# [Mabel Mania](https://mabel-mania.vercel.app/)

Mabel Mania is an open-source e-commerce platform built with modern web technologies to deliver an exceptional user experience. It leverages the power of Next.js, Tailwind CSS, Prisma, Auth.js, and Uploadcare to provide a seamless and robust platform for managing online stores.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Authentication:** [Auth.js](https://authjs.dev)
- **ORM:** [Prisma](https://www.prisma.io)
- **File Uploads:** [Uploadcare](https://uploadcare.com)
- **Payments:** [Xendit](https://xendit.co)

## Running Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/arfadmuzali/mabel-mania-ty.git
   ```

2. Install dependencies using your preferred package manager (e.g., `pnpm`, `npm`, or `yarn`):

   ```bash
   yarn install
   ```

3. Copy the `.env.example` file to `.env` and update the environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:

   ```bash
   yarn run dev
   ```

5. Push the database schema to your database:

   ```bash
   yarn prisma db push
   ```

6. Run any additional services, such as Xendit webhook listeners, if needed.

## How do I deploy this?

You can deploy Mabel Mania using platforms like [Vercel](https://vercel.com)
