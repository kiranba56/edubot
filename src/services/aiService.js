import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are EduBot, an intelligent AI assistant designed for college students. You help with AI/ML concepts, programming questions, project ideas, and general academic queries. You give clear, structured answers with examples when needed. You are friendly, concise, and educational. When explaining code, always use proper markdown code blocks.`;

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Check if Anthropic API key is properly set
export const isAiConfigured = Boolean(
  ANTHROPIC_API_KEY && 
  ANTHROPIC_API_KEY !== 'your_anthropic_key' &&
  ANTHROPIC_API_KEY.trim().length > 0
);

let anthropicClient = null;
if (isAiConfigured) {
  try {
    anthropicClient = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  } catch (err) {
    console.warn('Failed to initialize Anthropic client:', err);
  }
}

/**
 * Intelligent college AI fallback simulator for when API key is missing or testing offline.
 * Emits text chunks with realistic typing delay.
 */
async function streamSimulatedResponse(prompt, onToken) {
  const p = prompt.toLowerCase();
  let fullText = '';

  if (p.includes('neural') || p.includes('network')) {
    fullText = `### Understanding Neural Networks 🧠

A **Neural Network** is a computational model inspired by the biological neural networks in animal brains. It consists of layers of interconnected processing nodes (neurons).

#### 1. Core Architecture
- **Input Layer:** Receives raw features (e.g., pixel values, word tokens, sensor readings).
- **Hidden Layers:** Extract progressive abstract representations using weighted sums and non-linear activation functions.
- **Output Layer:** Produces predictions (classification probabilities or regression values).

#### 2. Mathematical Foundation
Each artificial neuron calculates:
$$z = \\sum_{i=1}^{n} (w_i \\cdot x_i) + b$$
$$a = \\sigma(z)$$

Where:
- $w_i$ represents synaptic weights
- $b$ is the bias offset
- $\\sigma$ is an activation function like **ReLU** ($f(x) = \\max(0, x)$) or **GELU**.

\`\`\`python
import numpy as np

class SimpleNeuron:
    def __init__(self, num_inputs):
        self.weights = np.random.randn(num_inputs) * 0.1
        self.bias = 0.0

    def forward(self, inputs):
        # Weighted sum + ReLU activation
        z = np.dot(inputs, self.weights) + self.bias
        return max(0.0, z)

# Example forward pass with 3 inputs
neuron = SimpleNeuron(num_inputs=3)
x = np.array([0.5, 1.2, -0.3])
output = neuron.forward(x)
print(f"Activated output: {output:.4f}")
\`\`\`

> **Key takeaway:** The real power of neural networks comes from **Backpropagation** with Gradient Descent, allowing the network to automatically adjust millions of weights to minimize loss.`;
  } else if (p.includes('gradient') || p.includes('descent')) {
    fullText = `### Gradient Descent Explained 📉

**Gradient Descent** is the primary optimization algorithm used to train machine learning models and deep neural networks by minimizing a cost or loss function $J(\\theta)$.

#### Intuition
Imagine being stranded on a foggy mountain peak trying to find the lowest valley. Since you can only see the ground directly beneath your feet, you take steps in the direction of the steepest descent until you reach the base.

#### The Update Rule
$$\\theta := \\theta - \\alpha \\nabla J(\\theta)$$

- $\\theta$: Model parameters (weights)
- $\\alpha$: Learning rate (step size)
- $\\nabla J(\\theta)$: Gradient vector of the loss function

\`\`\`python
def gradient_descent(x_start, learning_rate=0.1, epochs=50):
    x = x_start
    history = []
    
    # Example objective: f(x) = x^2, derivative: f'(x) = 2x
    for step in range(epochs):
        grad = 2 * x
        x = x - (learning_rate * grad)
        history.append(x)
        
    return x, history

optimal_x, _ = gradient_descent(x_start=10.0, learning_rate=0.05)
print(f"Optimal parameter found: {optimal_x:.6f}")
\`\`\`

#### Varieties:
1. **Batch Gradient Descent:** Computes gradient over the entire dataset.
2. **Stochastic Gradient Descent (SGD):** Updates weights after each individual sample.
3. **Mini-batch SGD / Adam:** Combines speed with stability (industry standard).`;
  } else if (p.includes('python') || p.includes('code')) {
    fullText = `### Python ML Quickstart 🐍

Here is a clean implementation of a classification pipeline using \`scikit-learn\` for college projects:

\`\`\`python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

# 1. Load dataset
data = load_iris()
X, y = data.data, data.target

# 2. Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Model initialization & training
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# 4. Evaluation
y_pred = clf.predict(X_test)
print(f"Test Accuracy: {accuracy_score(y_test, y_pred) * 100:.2f}%\n")
print(classification_report(y_test, y_pred, target_names=data.target_names))
\`\`\`

Feel free to paste your specific code snippet or error stack trace and I'll debug it for you!`;
  } else if (p.includes('project') || p.includes('idea')) {
    fullText = `### High-Impact College AI Project Ideas 🚀

Here are 4 standout AI projects that impress professors and recruiters:

1. **Multimodal Academic Paper Summarizer & QA**
   - **Tech Stack:** LangChain, Claude/Gemini API, FAISS vector database, Streamlit or React.
   - **Features:** Upload PDF research papers, ask questions with citations, extract tables.

2. **Automated Classroom Attendance & Emotion Analytics**
   - **Tech Stack:** OpenCV, YOLOv8, PyTorch, FastAPI.
   - **Features:** Real-time multi-face recognition, bounding box tracking, attentiveness score.

3. **Autonomous Code Review & Security Auditor**
   - **Tech Stack:** AST parsing in Python, LLM prompting with RAG, GitHub Actions webhook.
   - **Features:** Detects SQL injections, memory leaks, and proposes optimized diffs.

4. **Edge AI Plant Disease Classifier for Agriculture**
   - **Tech Stack:** MobileNetV3 / EfficientNet, TensorFlow Lite, Raspberry Pi or Flutter mobile app.
   - **Features:** Offline inference on edge devices, 98% accuracy on tomato leaf disease.

Which domain excites you most: **Computer Vision**, **Natural Language Processing (NLP)**, or **Autonomous Agents**?`;
  } else {
    fullText = `Hello! I'm **EduBot**, your AI study partner. 

You asked:
> *"${prompt}"*

### Summary & Academic Insights
In artificial intelligence and computer science, solving problems requires breaking down complex concepts into foundational principles:

1. **Problem Formulation:** Identifying the state space, objective function, and constraints.
2. **Algorithmic Selection:** Choosing between classical algorithms (heuristic search, dynamic programming) and modern statistical approaches (deep neural networks, reinforcement learning).
3. **Validation & Metrics:** Rigorously testing with cross-validation, precision/recall, or convergence criteria.

\`\`\`python
# Pro-tip for clean AI project structure
def evaluate_model(model, val_loader, criterion):
    model.eval()
    total_loss = 0.0
    # Add your inference pipeline here
    return total_loss
\`\`\`

Let me know if you would like me to dive deeper into theoretical proofs, practical code examples, or exam preparation questions!`;
  }

  // Stream in realistic word/punctuation chunks
  const words = fullText.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = (i === 0 ? '' : ' ') + words[i];
    onToken(chunk);
    await new Promise((res) => setTimeout(res, 22));
  }
}

/**
 * Stream completion from Anthropic Claude API (or intelligent fallback if unconfigured).
 *
 * @param {Array<{role: string, content: string}>} messageHistory
 * @param {(token: string) => void} onToken
 * @param {number} maxRetries
 */
export async function streamChatResponse(messageHistory, onToken, maxRetries = 2) {
  // Format message history: keep only valid roles and max 10 messages for context
  const trimmed = messageHistory
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-10)
    .map(m => ({
      role: m.role,
      content: m.content || '',
    }));

  const latestUserMessage = trimmed[trimmed.length - 1]?.content || 'Hello';

  // If Anthropic is not configured or client failed, use educational simulator
  if (!isAiConfigured || !anthropicClient) {
    await streamSimulatedResponse(latestUserMessage, onToken);
    return;
  }

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    try {
      // Use Claude 3.5 Haiku (or 3-haiku) with streaming
      const stream = await anthropicClient.messages.stream({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      });

      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta &&
          chunk.delta.type === 'text_delta'
        ) {
          onToken(chunk.delta.text);
        }
      }

      return; // Completed successfully
    } catch (err) {
      lastError = err;
      console.warn(`Anthropic API attempt ${attempt + 1} failed:`, err);

      // Handle 401 Unauthorized or invalid API key immediately by falling back
      if (err?.status === 401 || err?.message?.includes('401') || err?.message?.includes('invalid_api_key')) {
        console.warn('Anthropic API Key is unauthorized or expired. Falling back to local educational simulator.');
        await streamSimulatedResponse(latestUserMessage, onToken);
        return;
      }

      // Handle rate limits (429) or temporary server errors (500/503)
      if (err?.status === 429 || err?.status >= 500) {
        attempt++;
        if (attempt <= maxRetries) {
          // Exponential backoff
          await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt)));
          continue;
        }
      }

      break;
    }
  }

  // If all retries failed, fall back smoothly so student still gets answer
  console.warn('Anthropic API reached max retries. Providing fallback response.');
  await streamSimulatedResponse(latestUserMessage, onToken);
}
