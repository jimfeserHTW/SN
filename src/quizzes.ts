// Practice per sub-chapter: QUIZZES[topic][sub-chapter]. The tasks live next to their topic in src/topics/<topic>/quiz.ts.
// No React or CSS here, so the tests can import every task directly.
import einfuehrung from './topics/einfuehrung/quiz.ts'
import architektur from './topics/architektur/quiz.ts'
import images from './topics/images/quiz.ts'
import daten from './topics/daten/quiz.ts'
import netzwerk from './topics/netzwerk/quiz.ts'
import isolation from './topics/isolation/quiz.ts'
import compose from './topics/compose/quiz.ts'
import absturz from './topics/absturz/quiz.ts'
import type { Task } from './components/quizModel.ts'

export { QUIZ_EN } from './components/quizModel.ts'
export const QUIZZES: Record<string, Record<string, Task[]>> = {
  einfuehrung, architektur, images, daten, netzwerk, isolation, compose, absturz,
}
