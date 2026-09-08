"""
Seeds the database with several complete, realistic meetings so the app
is immediately usable without any manual data entry.

Run once with:
    python seed.py

Re-running this script wipes and recreates all tables first, so it's
always safe to re-seed from scratch during development.
"""
import datetime

from database import Base, engine, SessionLocal
import models


def build_segments(turns, start_gap=7.0):
    """turns: list of (speaker, text) -> list of segment dicts with timestamps."""
    segments = []
    t = 0.0
    for speaker, text in turns:
        duration = max(3.0, len(text.split()) * 0.45)
        segments.append(
            {
                "speaker": speaker,
                "text": text,
                "start_time": round(t, 1),
                "end_time": round(t + duration, 1),
            }
        )
        t += duration + start_gap * 0.35
    return segments


MEETINGS = [
    {
        "title": "Sales Kickoff Call - Fireflies.ai x Acme",
        "date": datetime.datetime(2026, 8, 25, 15, 30),
        "participants": ["Priya Sharma", "Daniel Cho", "Meera Iyer"],
        "tags": ["sales", "kickoff"],
        "summary": (
            "Priya introduced Fireflies.ai's platform to Acme's procurement team, focusing on "
            "automated meeting transcription and searchable call history. Daniel walked through "
            "Acme's current pain points with manual note-taking across their 40-person sales org. "
            "The group agreed on a two-week pilot with the sales and customer success teams before "
            "a broader company-wide rollout is considered. Meera raised questions about SOC2 "
            "compliance and data retention, which Priya confirmed are both fully supported."
        ),
        "topics": [
            ("Introductions and agenda", 0),
            ("Acme's current note-taking workflow", 45),
            ("Fireflies platform walkthrough", 120),
            ("Security and compliance questions", 210),
            ("Pilot scope and next steps", 260),
        ],
        "action_items": [
            ("Send Acme a pilot agreement covering sales + CS teams", "Priya Sharma", False),
            ("Share SOC2 Type II report and data retention policy", "Priya Sharma", False),
            ("Get pilot sign-off from Acme's IT security team", "Daniel Cho", False),
            ("Schedule kickoff training session for pilot users", "Meera Iyer", False),
        ],
        "turns": [
            ("Priya Sharma", "Thanks everyone for joining. I'm Priya, I lead solutions engineering at Fireflies. Excited to walk you through the platform today."),
            ("Daniel Cho", "Thanks for having us. I'm Daniel, I head up sales ops here at Acme. This is Meera from our IT security team."),
            ("Meera Iyer", "Hi everyone, glad to be here."),
            ("Priya Sharma", "Great, let's dive in. Can you tell me a bit about how your team currently handles meeting notes?"),
            ("Daniel Cho", "Honestly, it's a mess. Reps either forget to take notes or they're so busy talking they miss details. We lose a lot of context between calls."),
            ("Priya Sharma", "That's exactly the problem we solve. Fireflies joins your calls automatically, transcribes everything with speaker labels, and generates a summary and action items right after the call ends."),
            ("Daniel Cho", "How accurate is the transcription for technical sales conversations? We use a lot of product-specific jargon."),
            ("Priya Sharma", "Very accurate out of the box, and you can also add a custom vocabulary list for your product terms to improve it further."),
            ("Meera Iyer", "I have to ask about compliance. Are you SOC2 certified? And what's your data retention policy?"),
            ("Priya Sharma", "Yes, we're SOC2 Type II certified. Data is encrypted at rest and in transit, and you control retention windows per workspace, anywhere from 30 days to indefinite."),
            ("Meera Iyer", "That's good to hear. I'll want the full report before we move forward though."),
            ("Priya Sharma", "Of course, I'll send that over today."),
            ("Daniel Cho", "What would a pilot look like on our end?"),
            ("Priya Sharma", "Typically two weeks with a focused group, say your sales and customer success teams. We track adoption and time saved, then review results together."),
            ("Daniel Cho", "That works for us. Let's do sales and CS, about 15 people total."),
            ("Priya Sharma", "Perfect, I'll draft the pilot agreement and send it over by end of day."),
            ("Meera Iyer", "And I'll need sign-off from our security team before anyone connects their calendar."),
            ("Daniel Cho", "I'll get that moving on our side."),
            ("Priya Sharma", "Sounds good. I'll also set up a short training session so the pilot users know how to use the search and summary features."),
            ("Daniel Cho", "Appreciate it. This has been really helpful, thanks Priya."),
            ("Priya Sharma", "Thanks both, talk soon!"),
        ],
    },
    {
        "title": "Product Roadmap Planning - Q3",
        "date": datetime.datetime(2026, 8, 20, 11, 0),
        "participants": ["Arjun Mehta", "Sophie Laurent", "Kevin Wu", "Ritika Nair"],
        "tags": ["product", "planning"],
        "summary": (
            "The product team reviewed Q3 priorities, weighing the new AI chat feature against "
            "requested integrations with Slack and Notion. Arjun presented usage data showing "
            "search is the most-used feature after transcription. The team decided to prioritize "
            "the Slack integration for Q3 and push the AI chat feature to Q4 to allow more time "
            "for evaluation quality testing. Ritika will own the integration spec."
        ),
        "topics": [
            ("Q2 retro and usage data review", 0),
            ("AI chat feature proposal", 90),
            ("Slack and Notion integration requests", 180),
            ("Prioritization discussion", 260),
            ("Q3 roadmap decision", 330),
        ],
        "action_items": [
            ("Write integration spec for Slack notifications", "Ritika Nair", False),
            ("Push AI chat feature to Q4 roadmap doc", "Arjun Mehta", True),
            ("Follow up with 5 customers who requested Notion integration", "Kevin Wu", False),
            ("Share updated Q3 roadmap with leadership", "Arjun Mehta", False),
        ],
        "turns": [
            ("Arjun Mehta", "Let's start with a quick look at Q2 usage data before we plan Q3. Search is now our second most used feature after transcription itself."),
            ("Sophie Laurent", "That tracks with the support tickets I've been seeing. People really want better filtering in search too."),
            ("Kevin Wu", "On the customer side, the two biggest asks I keep hearing are Slack notifications and a Notion export."),
            ("Arjun Mehta", "Good, that lines up with what I wanted to discuss. I also want to propose we start building the AI chat feature this quarter, letting users ask questions about a meeting directly."),
            ("Ritika Nair", "I love that idea long term, but I'm worried about scope. Chat needs solid evaluation testing before we ship it, or we'll get bad answers and lose trust."),
            ("Sophie Laurent", "Agreed, that's a bigger lift than it looks. The Slack integration feels more contained and higher impact per hour of engineering time."),
            ("Kevin Wu", "From a sales perspective, Slack integration is also easier to demo and closes more deals right now."),
            ("Arjun Mehta", "That's fair. Let's push AI chat to Q4 and give it the evaluation time it deserves. Ritika, can you own the Slack integration spec?"),
            ("Ritika Nair", "Yes, I can have a draft spec by end of next week."),
            ("Arjun Mehta", "What about Notion? Is that a Q3 candidate too?"),
            ("Kevin Wu", "I think we need more signal first. Let me follow up with the five customers who explicitly asked for it and see how critical it really is for them."),
            ("Sophie Laurent", "Sounds reasonable. So for Q3: Slack integration is the headline feature, search filtering improvements as a smaller workstream, and Notion stays in discovery."),
            ("Arjun Mehta", "Agreed. I'll update the roadmap doc and share it with leadership this week."),
            ("Ritika Nair", "Sounds like a plan. I'll get started on the spec today."),
        ],
    },
    {
        "title": "Engineering Standup - Sprint 14",
        "date": datetime.datetime(2026, 8, 27, 9, 15),
        "participants": ["Wei Zhang", "Fatima Al-Sayed", "Tom Baker"],
        "tags": ["engineering", "standup"],
        "summary": (
            "Quick daily standup covering sprint 14 progress. Wei finished the transcript "
            "search indexing work and is moving on to pagination. Fatima is blocked on the "
            "media player seek-bar sync bug and needs a code review from Tom. Tom will "
            "review this afternoon and also flagged a flaky test in the CI pipeline that "
            "needs investigation before the sprint ends."
        ),
        "topics": [
            ("Yesterday's progress", 0),
            ("Search indexing completion", 25),
            ("Media player sync bug", 70),
            ("CI flaky test", 120),
        ],
        "action_items": [
            ("Review Fatima's PR for the seek-bar sync fix", "Tom Baker", False),
            ("Investigate flaky test in transcript upload pipeline", "Tom Baker", False),
            ("Start pagination work for meeting list endpoint", "Wei Zhang", False),
        ],
        "turns": [
            ("Wei Zhang", "I finished the search indexing work yesterday, all transcript segments are now indexed for full-text search."),
            ("Fatima Al-Sayed", "Nice, I'll wire the frontend search bar up to that today."),
            ("Wei Zhang", "Sounds good. I'm starting on pagination for the meeting list endpoint next since we're seeding a lot more sample data now."),
            ("Tom Baker", "Makes sense, the list was getting slow with more than fifty meetings."),
            ("Fatima Al-Sayed", "I'm still blocked on the seek-bar sync bug. Clicking a transcript line seeks the player, but the timestamp is off by about two seconds."),
            ("Tom Baker", "Is that a rounding issue in the duration calculation?"),
            ("Fatima Al-Sayed", "I think so, but I'd like a second pair of eyes. Can you review my PR this afternoon?"),
            ("Tom Baker", "Yep, I'll take a look after standup."),
            ("Tom Baker", "Also heads up, I noticed a flaky test in the transcript upload pipeline, it fails maybe one in five runs on CI."),
            ("Wei Zhang", "Worth fixing before sprint end so it doesn't block the release."),
            ("Tom Baker", "Agreed, I'll dig into it today."),
        ],
    },
]


def run():
    print("Dropping and recreating all tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        for m in MEETINGS:
            meeting = models.Meeting(
                title=m["title"],
                date=m["date"],
                media_url="/static/sample-media/sample-meeting.mp3",
            )
            db.add(meeting)
            db.flush()  # assigns meeting.id so relationship appends below work

            for name in m["participants"]:
                participant = (
                    db.query(models.Participant)
                    .filter(models.Participant.name == name)
                    .first()
                )
                if not participant:
                    participant = models.Participant(name=name)
                    db.add(participant)
                    db.flush()
                meeting.participants.append(participant)

            for tag_name in m["tags"]:
                tag = db.query(models.Tag).filter(models.Tag.name == tag_name).first()
                if not tag:
                    tag = models.Tag(name=tag_name)
                    db.add(tag)
                    db.flush()
                meeting.tags.append(tag)

            segments = build_segments(m["turns"])
            max_end = 0.0
            for idx, seg in enumerate(segments):
                db.add(
                    models.TranscriptSegment(
                        meeting_id=meeting.id,
                        speaker=seg["speaker"],
                        text=seg["text"],
                        start_time=seg["start_time"],
                        end_time=seg["end_time"],
                        order_index=idx,
                    )
                )
                max_end = max(max_end, seg["end_time"])
            meeting.duration_seconds = int(max_end) + 15

            db.add(models.Summary(meeting_id=meeting.id, overview=m["summary"]))

            for title, start_time in m["topics"]:
                db.add(
                    models.Topic(
                        meeting_id=meeting.id, title=title, start_time=start_time
                    )
                )

            for text, assignee, done in m["action_items"]:
                db.add(
                    models.ActionItem(
                        meeting_id=meeting.id,
                        text=text,
                        assignee=assignee,
                        is_completed=done,
                    )
                )

            db.commit()
            print(f"Seeded: {m['title']}")

        print(f"\nDone. Seeded {len(MEETINGS)} meetings.")
    finally:
        db.close()


if __name__ == "__main__":
    run()