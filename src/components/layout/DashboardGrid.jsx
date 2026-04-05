import {
  ProfileCard,
  ExperienceCard,
  EducationCard,
  SkillsCard,
  ProjectsCard,
  LinksCard,
} from '../cards/index'

export function DashboardGrid({ profile, onOpen }) {
  return (
    <div className="dashboard-grid anim-fade">
      <ProfileCard
        profile={profile}
        onClick={() => onOpen('overview')}
      />
      <ExperienceCard
        experience={profile.experience}
        onClick={() => onOpen('experience')}
      />
      <EducationCard
        education={profile.education}
        onClick={() => onOpen('education')}
      />
      <SkillsCard
        skills={profile.skills}
        onClick={() => onOpen('skills')}
      />
      <ProjectsCard
        projects={profile.projects}
        onClick={() => onOpen('projects')}
      />
      <LinksCard
        links={profile.links}
        onClick={() => onOpen('links')}
      />
    </div>
  )
}
