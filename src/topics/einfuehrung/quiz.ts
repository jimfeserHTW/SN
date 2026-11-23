import type { Task } from '../../components/quizModel.ts'
import docker from './quiz-docker.ts'
import compose from './quiz-compose.ts'

// One deck, so one quiz: the Docker tasks first, then the Compose tasks.
const quiz: Record<string, Task[]> = { start: [...docker.start, ...compose.start] }
export default quiz
