from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Project, Team, User, ProjectStatus
from app.schemas.all_schemas import ProjectCreate, ProjectUpdate, ProjectOut, JudgeScoreRequest
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/all-submitted", response_model=List[ProjectOut])
@router.get("/submitted-list", response_model=List[ProjectOut])
@router.get("/all", response_model=List[ProjectOut])
def get_all_submitted_projects(db: Session = Depends(get_db)):
    """
    Returns all submitted projects for Judge Demo review.
    """
    projs = db.query(Project).all()
    return [ProjectOut.model_validate(p) for p in projs]

@router.post("", response_model=ProjectOut)
def create_project(proj_in: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=400, detail="Must be part of a team to create a project")

    team = db.query(Team).filter(Team.id == current_user.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    existing_proj = db.query(Project).filter(Project.team_id == team.id).first()
    if existing_proj:
        raise HTTPException(status_code=400, detail="Team already has a project created. Update existing project instead.")

    proj = Project(
        team_id=team.id,
        title=proj_in.title,
        description=proj_in.description,
        track=proj_in.track,
        tech_stack=proj_in.tech_stack,
        github_url=proj_in.github_url,
        demo_url=proj_in.demo_url,
        status=ProjectStatus.DRAFT.value
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)

    return ProjectOut.model_validate(proj)

@router.get("/my-project", response_model=ProjectOut)
def get_my_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="User has no team")

    proj = db.query(Project).filter(Project.team_id == current_user.team_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found for this team")

    return ProjectOut.model_validate(proj)

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, proj_in: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    if current_user.team_id != proj.team_id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to edit this project")

    if proj_in.title is not None:
        proj.title = proj_in.title
    if proj_in.description is not None:
        proj.description = proj_in.description
    if proj_in.track is not None:
        proj.track = proj_in.track
    if proj_in.tech_stack is not None:
        proj.tech_stack = proj_in.tech_stack
    if proj_in.github_url is not None:
        proj.github_url = proj_in.github_url
    if proj_in.demo_url is not None:
        proj.demo_url = proj_in.demo_url

    db.commit()
    db.refresh(proj)

    return ProjectOut.model_validate(proj)

@router.post("/{project_id}/judge-score", response_model=ProjectOut)
def score_project_as_judge(project_id: str, score_in: JudgeScoreRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Allows Judges & Admins to submit rubric scores across 4 categories:
    Technical Execution (30%), Innovation (30%), Design (20%), Impact (20%).
    """
    import json
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    total = score_in.technical_execution + score_in.innovation + score_in.design + score_in.impact
    rubric_data = {
        "technical_execution": score_in.technical_execution,
        "innovation": score_in.innovation,
        "design": score_in.design,
        "impact": score_in.impact,
        "judge_name": current_user.name,
        "judge_email": current_user.email
    }

    proj.judge_score = round(total, 2)
    proj.judge_rubric_json = json.dumps(rubric_data)
    if score_in.feedback:
        proj.feedback = score_in.feedback
    proj.status = ProjectStatus.EVALUATED.value

    db.commit()
    db.refresh(proj)
    return ProjectOut.model_validate(proj)
