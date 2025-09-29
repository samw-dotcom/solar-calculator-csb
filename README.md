# Solar Savings Calculator

A responsive solar savings calculator built with React, TypeScript, and Tailwind CSS.

## Features

- **System Size Estimation**: Calculates required solar system size in kW
- **Cost Estimation**: Provides price range based on industry standards ($2.50-$4.00/watt)
- **Lifetime Savings**: Estimates 25-year energy savings
- **Home Value Increase**: Shows estimated property value increase ($39,500-$79,000)
- **EV Support**: Accounts for additional energy usage from electric vehicles
- **Comprehensive Disclaimers**: Legal disclaimers for professional use

## Quick Start

1. **Clone this repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm run dev`
4. **Build for production**: `npm run build`

## Deployment to Vercel

1. **Create new GitHub repository**
2. **Upload all files from `/clean-deploy/` folder**
3. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Vite project
   - Click "Deploy"

## Embedding as iframe

After deployment, embed in WordPress using:

```html
<iframe 
  src="https://your-vercel-app.vercel.app" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite** for build tooling
- **Radix UI** for accessible components
- **Lucide React** for icons