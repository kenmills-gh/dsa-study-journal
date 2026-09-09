import os
from app import create_app
from extensions import db
from models.user import User
from models.problem import Problem
from models.attempt_log import AttemptLog

app = create_app()


def seed_database():
    with app.app_context():
        print("Resetting database tables...")
        db.drop_all()
        db.create_all()

        print("Creating demo user...")
        demo_user = User(username="demo_developer", email="demo@example.com")
        demo_user.set_password("password123")
        db.session.add(demo_user)
        db.session.commit()

        print("Seeding sample problems...")
        problems_data = [
            {
                "title": "Two Sum",
                "pattern_category": "Two Pointers",
                "difficulty": "Easy",
                "status": "Mastered",
                "external_url": "https://leetcode.com/problems/two-sum/",
            },
            {
                "title": "Longest Substring Without Repeating Characters",
                "pattern_category": "Sliding Window",
                "difficulty": "Medium",
                "status": "Needs Review",
                "external_url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
            },
            {
                "title": "Valid Parentheses",
                "pattern_category": "Monotonic Stack",
                "difficulty": "Easy",
                "status": "Mastered",
                "external_url": "https://leetcode.com/problems/valid-parentheses/",
            },
            {
                "title": "Invert Binary Tree",
                "pattern_category": "Trees & Graphs",
                "difficulty": "Easy",
                "status": "Learning",
                "external_url": "https://leetcode.com/problems/invert-binary-tree/",
            },
            {
                "title": "Coin Change",
                "pattern_category": "Dynamic Programming",
                "difficulty": "Medium",
                "status": "Needs Review",
                "external_url": "https://leetcode.com/problems/coin-change/",
            },
        ]

        created_problems = []
        for data in problems_data:
            problem = Problem(
                user_id=demo_user.id,
                title=data["title"],
                pattern_category=data["pattern_category"],
                difficulty=data["difficulty"],
                status=data["status"],
                external_url=data["external_url"],
            )
            db.session.add(problem)
            created_problems.append(problem)

        db.session.commit()

        print("Seeding sample attempt logs...")
        attempts_data = [
            {
                "problem": created_problems[0],
                "confidence_score": 5,
                "time_spent_minutes": 15,
                "code_solution": "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n}",
                "notes": "Used a Map for O(n) time complexity. Remember to store the index as the value.",
            },
            {
                "problem": created_problems[1],
                "confidence_score": 2,
                "time_spent_minutes": 35,
                "code_solution": "function lengthOfLongestSubstring(s) {\n  let set = new Set();\n  let left = 0, max = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    max = Math.max(max, right - left + 1);\n  }\n  return max;\n}",
                "notes": "Struggled with contracting the left boundary when duplicates appeared. Need to review sliding window shrinking mechanics.",
            },
            {
                "problem": created_problems[4],
                "confidence_score": 2,
                "time_spent_minutes": 45,
                "code_solution": "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (let coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
                "notes": "Bottom-up DP approach. Edge case: returning -1 if target amount cannot be reached.",
            },
        ]

        for attempt in attempts_data:
            log = AttemptLog(
                user_id=demo_user.id,
                problem_id=attempt["problem"].id,
                confidence_score=attempt["confidence_score"],
                time_spent_minutes=attempt["time_spent_minutes"],
                code_solution=attempt["code_solution"],
                notes=attempt["notes"],
            )
            db.session.add(log)

        db.session.commit()
        print("Database successfully seeded!")
        print("-----------------------------------")
        print("Demo Credentials:")
        print("Email: demo@example.com")
        print("Password: password123")
        print("-----------------------------------")


if __name__ == "__main__":
    seed_database()
