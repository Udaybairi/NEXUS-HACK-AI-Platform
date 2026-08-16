from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Project, Submission, User, ProjectStatus
from app.schemas.all_schemas import SubmissionOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.post("", response_model=SubmissionOut)
def submit_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="User must belong to a team to submit a project")

    proj = db.query(Project).filter(Project.team_id == current_user.team_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="No project found to submit")

    if not proj.github_url or not proj.description or len(proj.description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Project requires a valid description and GitHub repository URL before submission")

    now = datetime.now(timezone.utc)
    proj.status = ProjectStatus.SUBMITTED.value
    proj.submitted_at = now

    sub = Submission(
        project_id=proj.id,
        submitted_at=now,
        status="SUBMITTED"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    return SubmissionOut.model_validate(sub)

@router.get("/my-submission", response_model=SubmissionOut)
def get_my_submission(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="User has no team")

    proj = db.query(Project).filter(Project.team_id == current_user.team_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    sub = db.query(Submission).filter(Submission.project_id == proj.id).order_by(Submission.submitted_at.desc()).first()
    if not sub:
        raise HTTPException(status_code=404, detail="No submission recorded for this project")

    return SubmissionOut.model_validate(sub)

@router.get("/all-projects")
def get_all_projects_for_judging(db: Session = Depends(get_db)):
    """
    Returns list of all projects for Judge evaluation.
    """
    from app.schemas.all_schemas import ProjectOut
    projs = db.query(Project).all()
    return [ProjectOut.model_validate(p) for p in projs]
