# ✨ AI-CFM: AI Image Generator with Web Interface

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/0GhostArrow/AI-CFM)

<div align="center">

**🚀 Deploy your own free AI image generation API with a beautiful web interface!**

[Features](#-features) • [Quick Start](#-quick-start) • [Web Interface](#-web-interface) • [API Usage](#-api-usage) • [FAQ](#-faq) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

**AI-CFM** is a comprehensive AI image generation platform built on Cloudflare Workers. It provides both a beautiful **web interface** for visual image generation and a powerful **REST API** for programmatic access.

Generate stunning images from text prompts using state-of-the-art Stable Diffusion models - completely **free** with up to **100,000 generations per day**!

---

## ✨ Features

### 🌐 Web Interface
- **Beautiful, Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Preview**: See your generated images instantly
- **Multiple AI Models**: Choose from 6 different Stable Diffusion models
- **Download Support**: One-click download for generated images
- **Loading States**: Visual feedback during generation
- **Error Handling**: User-friendly error messages
- **Help Section**: Built-in instructions and API documentation

### ⚡ API Functionality
- **RESTful API**: Clean, simple API endpoints
- **Secure Authentication**: Optional API key protection
- **CORS Enabled**: Use from any application or website
- **Multiple Formats**: Accepts both JSON and Form Data
- **Fast Response**: Optimized for performance

---

## 🚀 Quick Deploy

### One-Click Deployment ⭐

Click the button below to deploy AI-CFM to Cloudflare Workers instantly:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/0GhostArrow/AI-CFM)

This will:
- ✅ Create a new Cloudflare Worker
- ✅ Configure necessary bindings
- ✅ Deploy your worker globally

**Note**: After deployment, you'll need to enable Workers AI and add the AI binding (see FAQ below).

---

## 📋 Quick Start

### Option 1: Use the Web Interface

1. **Deploy** using the button above
2. **Enable Workers AI** (see FAQ)
3. **Add AI binding** (see FAQ)
4. **Visit your worker URL** in a browser
5. **Enter a prompt** describing your image
6. **Click "Generate Image"** and watch the magic! ✨

### Option 2: Use the API

```bash
curl -X POST https://your-worker.workers.dev/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A futuristic city in the clouds with flying cars"}' \
  --output image.jpg
```

---

## 🌐 Web Interface

The web interface provides a complete, user-friendly experience:

### Features:
- 📝 **Prompt Input**: Large text area with helpful examples
- 🔑 **API Key Input**: Configure API key directly in browser (optional)
- 🤖 **Model Selection**: Dropdown with model descriptions
- 🚀 **Generate Button**: One-click image creation
- 🎨 **Image Preview**: Full-width image display
- 💾 **Download**: Save images instantly
- 🗑️ **Clear**: Start fresh with one click

### Tips for Better Results:
- **Be specific**: Include details like "4K", "detailed", "cinematic"
- **Mention style**: "oil painting", "photorealistic", "anime"
- **Add context**: Include lighting, mood, and environment details
- **Iterate**: Try different prompts and models

---

## 🔧 API Usage

### Endpoint
```
POST https://<your-worker-name>.<your-subdomain>.workers.dev/generate
```

### Request Body (JSON)

```json
{
  "prompt": "A monkey riding a bike",
  "model": "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  "api_key": "your-api-key-if-required"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to generate |
| `model` | string | No | AI model to use (defaults to Stable Diffusion XL Base 1.0) |
| `api_key` | string | No | API key if `env.API_KEY` is configured |

### Response

**Success (200 OK):**
Returns JPEG image binary data

**Error (4xx/5xx):**
```json
{
  "error": "Error message",
  "details": "More detailed error information"
}
```

---

## 📝 FAQ - Frequently Asked Questions

### 🚨 Common Issues & Solutions

#### Q1: I'm getting a 500 error when generating images

**Error:** `POST /generate 500 Failed to generate image`

**Solution:**
This is usually caused by missing Workers AI configuration. You need to:

1. **Enable Workers AI:**
   - Go to: https://dash.cloudflare.com/workers-and-pages/ai
   - Click **"Enable Workers AI"** (free tier available)

2. **Add AI Binding to your worker:**
   - Go to: https://dash.cloudflare.com/workers/pages/view/YOUR-WORKER-NAME
   - Click **"Settings"**
   - Scroll to **"Service bindings"**
   - Click **"Add binding"**
   - Configure:
     - **Variable name**: `AI`
     - **Service**: Select **"Workers AI"**
   - Click **"Save and Deploy"**

**Test:** Visit `https://your-worker.workers.dev/config` - it should return JSON with model information.

---

#### Q2: I'm getting "Unauthorized - Invalid or missing API key" error

**Error:** `401 Unauthorized`

**Cause:** You have `API_KEY` environment variable set but didn't provide it.

**Solutions:**

**Option A: Enter API key in web interface**
1. Visit your worker URL
2. Enter your API key in the input field at the top
3. It saves automatically in your browser

**Option B: Remove the API_KEY variable**
1. Go to your worker settings
2. Go to **"Variables"**
3. Find `API_KEY` and delete it
4. Deploy again

**Option C: Set the API key in environment**
1. Get your API key from the web interface or generate a new one
2. Set it as the `API_KEY` environment variable

---

#### Q3: The "Deploy to Cloudflare" button doesn't work

**Error:** Nothing happens when clicking the button

**Solution:**
1. Make sure you're logged into Cloudflare
2. Try opening the link in a new tab:
   ```
   https://deploy.workers.cloudflare.com/?url=https://github.com/0GhostArrow/AI-CFM
   ```
3. If still not working, deploy manually:
   ```bash
   git clone https://github.com/0GhostArrow/AI-CFM.git
   cd AI-CFM
   npm install -g wrangler
   wrangler login
   npm run deploy
   ```

---

#### Q4: My worker URL shows "Error: workers.api.error.unauthorized"

**Cause:** API key is required but not provided.

**Solution:**
1. Visit your worker URL
2. Enter the API key in the input field
3. Or remove the `API_KEY` environment variable from settings

---

#### Q5: Images are taking too long to generate

**Cause:** Some models are slower than others.

**Solution:**
- Use faster models for quick results:
  - **ByteDance XL Lightning** - Very fast
  - **Black Forest Labs U-XL Schnell** - Fast
- Use slower models for higher quality:
  - **Stable Diffusion XL Base 1.0** - Best quality
  - **DreamShaper 8 LCM** - Artistic

**Typical generation times:**
- Fast models: 3-5 seconds
- Standard models: 5-15 seconds
- High-quality models: 10-30 seconds

---

#### Q6: I get "Failed to generate image" with no details

**Cause:** Usually indicates an AI service issue.

**Solution:**
1. Check Cloudflare status: https://www.cloudflarestatus.com/
2. Verify Workers AI is enabled in your dashboard
3. Check the AI binding is configured correctly
4. Try a different model
5. Wait a few minutes and try again

---

#### Q7: The web interface doesn't load, but the API works

**Cause:** There might be an issue with the HTML rendering.

**Solution:**
1. Clear your browser cache
2. Try incognito/private mode
3. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
4. Check browser console for errors (F12 → Console)

---

#### Q8: Generated images are low quality or don't match my prompt

**Cause:** Prompt may not be detailed enough.

**Solution:**
- **Be specific**: Include subject, style, lighting, mood
- **Add details**: "4K", "detailed", "high resolution"
- **Mention style**: "photorealistic", "oil painting", "anime"
- **Specify composition**: "close-up", "wide shot", "portrait"
- **Add context**: "sunset", "indoor lighting", "studio setup"

**Example prompts:**
```
 Poor: "A dog"
 Good: "A golden retriever dog sitting in a sunny meadow, 
         photorealistic, 4K, detailed fur, blue sky background"

 Poor: "City at night"
 Good: "Cyberpunk city at night with neon lights, rainy streets,
         reflections, futuristic architecture, cinematic lighting, 8K"
```

---

#### Q9: I can't download generated images

**Cause:** Browser settings or CORS issues.

**Solution:**
1. Right-click the image and select "Save image as..."
2. Or click the "Download Image" button
3. If still not working, the image URL is:
   ```
   blob:https://your-worker.workers.dev/uuid
   ```
4. Copy the image URL and open it in a new tab

---

#### Q10: How do I rotate or delete my worker?

**Solution:**
1. Go to: https://dash.cloudflare.com/workers/pages/view/YOUR-WORKER-NAME
2. Click **"Settings"**
3. Scroll to the bottom
4. Click **"Delete Worker"**
5. Confirm deletion

**Note:** This will permanently delete your worker and all associated data.

---

### 🔧 Configuration FAQ

#### Q11: Do I need to set an API key?

**Answer:** No, it's optional!

- **Without API_KEY**: Anyone can use your worker (good for personal use)
- **With API_KEY**: Only people with the key can generate images (good for sharing)

To add an API key:
1. Go to your worker settings
2. Add environment variable: `API_KEY` = `your-secret-key`
3. Users must enter this key in the web interface

---

#### Q12: How many images can I generate for free?

**Answer:** 100,000 generations per day (Cloudflare Workers AI free tier)

This is more than enough for:
- Personal use
- Small projects
- Prototyping
- Learning

**Note:** Each generation counts as 1 request toward the 100,000 daily limit.

---

#### Q13: Can I use this commercially?

**Answer:** Yes! Under the MIT License.

However, be aware of:
- Cloudflare's Terms of Service
- The AI models' individual licenses (most are free for commercial use)
- Rate limits and fair use policies

---

#### Q14: How do I update my worker with new code?

**Solution:**

**Option 1: Automatic (via GitHub)**
1. Make changes to your GitHub repository
2. Cloudflare will automatically detect changes
3. Deploy happens automatically (may take a few minutes)

**Option 2: Manual**
1. Go to your worker dashboard
2. Click **"Deploy"** → **"Edit code"**
3. Paste the new `worker.js` code
4. Click **"Save and Deploy"**

**Option 3: Via Wrangler CLI**
```bash
git pull
npm run deploy
```

---

#### Q15: Can I use a custom domain?

**Answer:** Yes!

1. Go to your worker dashboard
2. Click **"Settings"** → **"Triggers"**
3. Click **"Add route"**
4. Enter your custom domain (e.g., `api.mydomain.com/*`)
5. Point your domain's DNS to Cloudflare
6. Configure SSL/TLS (Cloudflare handles this automatically)

---

### 💡 Tips & Best Practices

#### Security
- 🔒 Keep your API key secret
- 🔄 Rotate keys periodically
- 🚫 Don't commit keys to git
- ✅ Use HTTPS always

#### Performance
- ⚡ Use faster models for prototyping
- 🗄️ Cache generated images if possible
- 📊 Monitor your usage in Cloudflare dashboard

#### Development
- 🧪 Test with simple prompts first
- 📖 Read Cloudflare Workers documentation
- 🐛 Use `wrangler tail` to view real-time logs

---

### 🆘 Still Need Help?

1. **Check Cloudflare Status:**
   https://www.cloudflarestatus.com/

2. **Workers AI Documentation:**
   https://developers.cloudflare.com/workers-ai/

3. **Workers Documentation:**
   https://developers.cloudflare.com/workers/

4. **Open an Issue:**
   https://github.com/0GhostArrow/AI-CFM/issues

5. **Cloudflare Community:**
   https://community.cloudflare.com/

---

## 🛠️ Deployment

### One-Click Deploy (Recommended)

Click the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/0GhostArrow/AI-CFM)

### Manual Deployment

```bash
# Clone the repository
git clone https://github.com/0GhostArrow/AI-CFM.git
cd AI-CFM

# Install dependencies
npm install

# Deploy to Cloudflare
npm run deploy
```

---

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `API_KEY` | No | Secret API key for authentication (optional) |
| `AI` | Yes* | Workers AI binding (configured in dashboard) |

*Required for image generation, configured via Service Bindings.

---

## 🔒 Security

- **Keep your API key secret**: Never commit it to version control
- **Rotate keys regularly**: Generate a new key if compromised
- **Use HTTPS**: Always use encrypted connections
- **Validate inputs**: The API validates all inputs before processing

---

## 💰 Pricing

**100% Free!**

- **Cloudflare Workers**: Unlimited requests on free tier
- **Workers AI**: 100,000 generations per day free
- **Cloudflare CDN**: Global edge network included

See [Cloudflare Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) for details.

---

## 📄 License

MIT License - feel free to use in your own projects!

---

## 🙏 Acknowledgments

- [Cloudflare](https://cloudflare.com) - Hosting and AI infrastructure
- [Stability AI](https://stability.ai) - AI models
- [Cloudflare Workers Team](https://workers.cloudflare.com) - Serverless platform

---

<div align="center">

**⭐ Star this repo if it helped you!** ⭐

Made with ❤️ by [0GhostArrow](https://github.com/0GhostArrow)

</div>
