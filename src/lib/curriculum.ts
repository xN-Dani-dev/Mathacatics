export type Step =
  | { type: "learn"; title: string; body: string[] }
  | { type: "mcq"; q: string; options: string[]; answer: number; explain: string };
export type Lesson = { id: string; title: string; steps: Step[] };
export type Unit = { title: string; topic: string; lessons: Lesson[] };

const L = (id: string, title: string, steps: Step[]): Lesson => ({ id, title, steps });
const learn = (title: string, ...body: string[]): Step => ({ type: "learn", title, body });
const mcq = (q: string, options: string[], answer: number, explain: string): Step => ({ type: "mcq", q, options, answer, explain });

const S1: Unit[] = [
  {
    title: "Numbers", topic: "Numbers",
    lessons: [
      L("s1-1", "Natural & integer numbers", [
        learn("Two families of numbers", "Natural numbers are the counting numbers: 0, 1, 2, 3, …", "Integers also include the negatives: …, −3, −2, −1, 0, 1, 2, …", "Negative numbers appeared with money and debt: owing €5 is like having −5."),
        learn("Absolute value", "The absolute value is the distance from 0 on the number line.", "|−3| = 3 and |3| = 3. Distance is never negative!"),
        mcq("Which of these is an integer but NOT a natural number?", ["7", "0", "−4", "12"], 2, "−4 is negative, so it is an integer but not a natural number."),
        mcq("What is |−9|?", ["−9", "9", "0", "1/9"], 1, "−9 is 9 steps away from 0, so |−9| = 9."),
        learn("Comparing integers", "On the number line, numbers get bigger to the right.", "So −2 > −5, because −2 is to the right of −5.", "Transitivity: if a > b and b > c, then a > c."),
        mcq("Which is true?", ["−8 > −3", "−3 > −8", "−3 < −8", "−8 = −3"], 1, "−3 is closer to 0 (further right), so −3 > −8."),
        mcq("Order from smallest: 4, −6, 0, −1", ["−1, −6, 0, 4", "−6, −1, 0, 4", "0, −1, −6, 4", "4, 0, −1, −6"], 1, "Furthest left first: −6, then −1, 0, 4."),
      ]),
      L("s1-2", "Primes, factors & divisibility", [
        learn("Factors and divisors", "A factor (or divisor) of a number divides it exactly, with no remainder.", "The factors of 12 are 1, 2, 3, 4, 6 and 12.", "12 ÷ 4 = 3 exactly, so 4 is a factor of 12."),
        mcq("Which number is NOT a factor of 18?", ["2", "3", "4", "9"], 2, "18 ÷ 4 = 4.5, not a whole number, so 4 is not a factor."),
        learn("Prime numbers", "A prime number has exactly two factors: 1 and itself.", "Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, …", "1 is NOT prime (only one factor). 2 is the only even prime."),
        mcq("Which of these is prime?", ["1", "9", "15", "13"], 3, "13 has only the factors 1 and 13. 9 = 3×3 and 15 = 3×5."),
        mcq("Is 1 a prime number?", ["Yes", "No"], 1, "A prime needs exactly two different factors. 1 only has one."),
        learn("Divisibility tricks", "By 2: the last digit is even.", "By 3: the sum of the digits is divisible by 3 (e.g. 471 → 4+7+1 = 12 ✓).", "By 5: ends in 0 or 5.   By 10: ends in 0."),
        mcq("Which number is divisible by 3?", ["124", "452", "531", "700"], 2, "5 + 3 + 1 = 9, and 9 is divisible by 3."),
        mcq("Which number is divisible by both 2 and 5?", ["35", "52", "140", "225"], 2, "Divisible by 2 and 5 means divisible by 10: it must end in 0."),
        learn("Prime factor decomposition", "Every natural number can be written as a product of primes.", "24 = 2 × 2 × 2 × 3 = 2³ × 3", "Tip: keep dividing by the smallest prime that works: 24 → 12 → 6 → 3."),
        mcq("What is the prime factorisation of 36?", ["4 × 9", "2 × 18", "2² × 3²", "6²"], 2, "36 = 2 × 2 × 3 × 3 = 2² × 3². The others use non-primes."),
        mcq("60 = 2² × 3 × ?", ["4", "5", "10", "15"], 1, "2² × 3 = 12 and 12 × 5 = 60."),
        learn("HCF and LCM", "HCF (Highest Common Factor): the biggest number dividing all of them. Multiply the primes they share.", "LCM (Lowest Common Multiple): the smallest number they all divide. Take every prime with its highest power.", "12 = 2² × 3, 18 = 2 × 3² → HCF = 2 × 3 = 6, LCM = 2² × 3² = 36."),
        mcq("What is the HCF of 24 and 36?", ["6", "12", "72", "4"], 1, "24 = 2³×3, 36 = 2²×3². Shared: 2²×3 = 12."),
        mcq("What is the LCM of 4 and 6?", ["24", "2", "12", "10"], 2, "4 = 2², 6 = 2×3 → LCM = 2²×3 = 12."),
        mcq("Two buses leave together. One returns every 30 min, the other every 45 min. When are they together again?", ["After 75 min", "After 90 min", "After 15 min", "After 135 min"], 1, "We need the LCM of 30 and 45 = 90 minutes."),
      ]),
      L("s1-3", "Operations & order of operations", [
        learn("Signs rules", "Adding a negative = subtracting: 5 + (−3) = 2.", "× or ÷ two numbers: same signs → positive, different signs → negative.", "0 and 1 are special: a × 1 = a, a + 0 = a, a × 0 = 0."),
        mcq("(−4) × (−5) = ?", ["−20", "20", "−9", "9"], 1, "Same signs give a positive result."),
        learn("Order of operations", "1. Brackets  2. × and ÷ (left to right)  3. + and − (left to right)", "3 + 4 × 2 = 3 + 8 = 11, not 14!"),
        mcq("6 + 12 ÷ 3 = ?", ["6", "10", "18", "2"], 1, "Divide first: 12 ÷ 3 = 4, then 6 + 4 = 10."),
        mcq("(2 + 3) × 4 = ?", ["14", "20", "24", "9"], 1, "Brackets first: 5 × 4 = 20."),
      ]),
      L("s1-4", "Fractions & decimals", [
        learn("What is a fraction?", "A fraction is a ratio of two integers: numerator / denominator.", "Equivalent fractions: 8/12 = 10/15 = 2/3. Simplify by dividing top and bottom by the HCF."),
        mcq("Simplify 18/24", ["9/12", "3/4", "2/3", "6/8"], 1, "HCF of 18 and 24 is 6: 18÷6 / 24÷6 = 3/4."),
        learn("Fractions ↔ decimals", "Divide the top by the bottom: 3/4 = 3 ÷ 4 = 0.75.", "0.4 = 4/10 = 2/5."),
        mcq("Which is largest?", ["0.6", "1/2", "3/5", "0.65"], 3, "1/2 = 0.5 and 3/5 = 0.6, so 0.65 is the largest."),
      ]),
    ],
  },
  {
    title: "Sets", topic: "Set theory",
    lessons: [
      L("s1-5", "Sets & Venn diagrams", [
        learn("Sets", "A set is a collection of elements: A = {1, 2, 3}.", "∈ means 'is an element of': 2 ∈ A. ∉ means 'is not': 5 ∉ A.", "∅ is the empty set. The universal set U contains everything we consider."),
        learn("Union, intersection, complement", "A ∪ B: elements in A or B (or both).", "A ∩ B: elements in both A and B.", "A′ (complement): elements of U not in A.  A ⊂ B: every element of A is in B."),
        mcq("A = {1,2,3,4}, B = {3,4,5}. A ∩ B = ?", ["{1,2,3,4,5}", "{3,4}", "{1,2}", "{5}"], 1, "Only 3 and 4 are in both sets."),
        mcq("Same sets. A ∪ B = ?", ["{3,4}", "{1,2,5}", "{1,2,3,4,5}", "∅"], 2, "Union collects every element from both sets."),
      ]),
    ],
  },
  {
    title: "Algebra", topic: "Algebra",
    lessons: [
      L("s1-6", "Patterns & sequences", [
        learn("Arithmetic sequences", "5, 9, 13, 17, … adds 4 each time.", "General rule: 4n + 1. For n = 100: 4 × 100 + 1 = 401."),
        mcq("Next term of 3, 8, 13, 18, …?", ["21", "23", "22", "28"], 1, "It adds 5 each time: 18 + 5 = 23."),
        mcq("Rule 3n + 2. What is the 10th term?", ["32", "15", "30", "35"], 0, "3 × 10 + 2 = 32."),
      ]),
      L("s1-7", "Expressions & linear equations", [
        learn("Simplifying", "a + a + a = 3a.  2x + 5x = 7x.  You can only combine like terms."),
        learn("Solving equations", "Do the same thing to both sides to get x alone.", "3x + 2 = x + 10 → 2x = 8 → x = 4."),
        mcq("Solve 2x + 3 = 11", ["x = 7", "x = 4", "x = 5.5", "x = 8"], 1, "2x = 8, so x = 4."),
        mcq("Solve 5x − 4 = 2x + 8", ["x = 4", "x = 2", "x = 12", "x = 1.33"], 0, "3x = 12, so x = 4."),
      ]),
    ],
  },
  {
    title: "Geometry", topic: "Geometry",
    lessons: [
      L("s1-8", "Plotting points", [
        learn("Coordinates", "A point (x, y): go x steps across, then y steps up.", "(−2, 3) means 2 left, 3 up."),
        mcq("Which point is 4 right and 1 down from the origin?", ["(1, −4)", "(4, −1)", "(−4, 1)", "(4, 1)"], 1, "x = 4 (right), y = −1 (down)."),
      ]),
      L("s1-9", "2D shapes", [
        learn("Triangles", "Equilateral: 3 equal sides. Isosceles: 2 equal sides. Scalene: none equal. Right-angled: one 90° angle."),
        learn("Quadrilaterals", "Square, rectangle, rhombus, parallelogram, kite, trapezium.", "A trapezium has at least one pair of parallel sides."),
        mcq("A triangle with exactly two equal sides is…", ["Equilateral", "Scalene", "Isosceles", "Right-angled"], 2, "Isosceles = two equal sides."),
        mcq("How many sides does a regular octagon have?", ["6", "8", "10", "7"], 1, "Octa = 8."),
      ]),
      L("s1-10", "Lines, angles & triangles", [
        learn("Constructions", "Use a protractor for angles and a set-square for parallel and perpendicular lines.", "A triangle can be built from SSS, SAS, SSA or ASA information."),
        mcq("Perpendicular lines meet at…", ["45°", "180°", "90°", "They never meet"], 2, "Perpendicular means at a right angle: 90°."),
        mcq("A quarter turn is…", ["90°", "180°", "45°", "360°"], 0, "A full turn is 360°, ¼ of it is 90°."),
      ]),
      L("s1-11", "3D shapes & nets", [
        learn("Faces, edges, vertices", "A cube has 6 faces, 12 edges and 8 vertices.", "A net is a flat shape that folds into a 3D solid."),
        mcq("How many edges does a cuboid have?", ["6", "8", "12", "10"], 2, "Like a cube: 12 edges."),
        mcq("Which solid has one curved face and one flat circular face?", ["Cylinder", "Cone", "Sphere", "Pyramid"], 1, "A cone: one circle base plus a curved surface."),
      ]),
      L("s1-12", "Perimeter, area & units", [
        learn("Formulas", "Rectangle: perimeter = 2(l + w), area = l × w.", "Square: perimeter = 4s, area = s².", "Units: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g."),
        mcq("Area of a 7 cm × 4 cm rectangle?", ["22 cm²", "28 cm²", "11 cm²", "28 cm"], 1, "7 × 4 = 28 cm²."),
        mcq("2.5 km = ? m", ["250", "25", "2500", "25000"], 2, "× 1000: 2500 m."),
        mcq("How many 1 cm cubes fit in a 2 × 3 × 4 cm cuboid?", ["9", "24", "12", "20"], 1, "2 × 3 × 4 = 24."),
      ]),
    ],
  },
];

const outline = (prefix: string, units: [string, string[]][]): Unit[] =>
  units.map(([title, lessons]) => ({
    title, topic: title,
    lessons: lessons.map((t, i) => L(`${prefix}-${title}-${i}`, t, [])),
  }));

const S2 = outline("s2", [
  ["Numbers", ["Rounding & significant figures", "Adding & subtracting fractions", "Multiplying & dividing fractions", "Powers & power rules", "Percentages", "Ratios & scale drawings"]],
  ["Algebra", ["Reading graphs", "Linear & quadratic situations", "Expanding brackets", "Linear equations"]],
  ["Geometry", ["Classifying quadrilaterals & triangles", "Ruler & compass constructions", "Symmetry", "Areas of quadrilaterals & triangles", "Circles & π", "Area & volume units"]],
  ["Statistics", ["Collecting data", "Statistical diagrams", "Mean, median & mode"]],
]);
const S3 = outline("s3", [
  ["Numbers", ["Square roots", "Negative powers & bases", "Scientific notation", "Inverses", "Percentage increase & decrease"]],
  ["Algebra", ["Linear functions y = ax + b", "Gradients & intercepts", "Direct & inverse proportion", "Rearranging formulas", "Expanding & factorising", "Harder linear equations"]],
  ["Geometry", ["Angles & parallel lines", "Transformations"]],
  ["Statistics", ["Statistics & probability"]],
]);

export const curriculum: Record<string, Unit[]> = { S1, S2, S3 };
export const findLesson = (id: string) =>
  Object.values(curriculum).flat().flatMap((u) => u.lessons).find((l) => l.id === id);

const DONE = "whiskers-done";
export const loadDone = (): string[] => { try { return JSON.parse(localStorage.getItem(DONE) || "[]"); } catch { return []; } };
export const markDone = (id: string) => localStorage.setItem(DONE, JSON.stringify([...new Set([...loadDone(), id])]));
