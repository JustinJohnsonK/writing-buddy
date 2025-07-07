This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




Loading Site:

npm run build

sudo cp -r out/* /var/www/html/

Configure Nginx for Static Site and API Proxy
/etc/nginx/sites-available/writing-buddy
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend (private)
    location /api/ {
        proxy_pass http://localhost:5500/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

sudo ln -s /etc/nginx/sites-available/writing-buddy /etc/nginx/sites-enabled/

sudo nginx -t

sudo systemctl reload nginx


5. Set Up HTTPS with Let’s Encrypt
Install Certbot:

Obtain and install certificate:

Certbot will update your Nginx config for HTTPS.

6. Update DNS on GoDaddy
Log in to GoDaddy.
Set an A record for yourdomain.com pointing to your Linode VM’s public IP.

8. Restart Services
Make sure your backend Docker service is running and listening on localhost:5500.
Restart Nginx if needed:
sudo systemctl restart nginx

Firebase AUTH
Add Your Production Domain to Firebase Authorized Domains
Go to Firebase Console.
Select your project.
In the left menu, go to Authentication > Settings.
Under Authorized domains, click Add domain.
Add your production domain (e.g., yourdomain.com).