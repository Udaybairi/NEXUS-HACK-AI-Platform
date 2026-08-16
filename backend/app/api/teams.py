import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.all_models import Team, User, UserRole
from app.schemas.all_schemas import TeamCreate, TeamMemberAdd, TeamOut, UserOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.post("", response_model=TeamOut)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.team_id:
        raise HTTPException(status_code=400, detail="User already belongs to a team")

    code = secrets.token_hex(4).upper()
    team = Team(
        name=team_in.name,
        code=code,
        track=team_in.track or "General AI",
        leader_id=current_user.id
    )
    db.add(team)
    db.commit()
    db.refresh(team)

    # Assign team lead role and set team_id for user
    current_user.team_id = team.id
    current_user.role = UserRole.TEAM_LEAD.value
    db.commit()
    db.refresh(team)

    return TeamOut.model_validate(team)

@router.get("/my-team", response_model=TeamOut)
def get_my_team(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="User is not part of any team")
    team = db.query(Team).filter(Team.id == current_user.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return TeamOut.model_validate(team)

@router.post("/{team_id}/members", response_model=TeamOut)
def add_team_member(team_id: str, member_in: TeamMemberAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if team.leader_id != current_user.id and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Only team leader can add members")

    target_user = db.query(User).filter(User.email == member_in.email.lower()).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User with this email not found")

    if target_user.team_id:
        raise HTTPException(status_code=400, detail="User is already in another team")

    target_user.team_id = team.id
    db.commit()
    db.refresh(team)

    return TeamOut.model_validate(team)

@router.post("/join/{code}", response_model=TeamOut)
def join_team_by_code(code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.team_id:
        raise HTTPException(status_code=400, detail="User is already in a team")

    team = db.query(Team).filter(Team.code == code.upper()).first()
    if not team:
        raise HTTPException(status_code=404, detail="Invalid team join code")

    current_user.team_id = team.id
    db.commit()
    db.refresh(team)

    return TeamOut.model_validate(team)
