import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Edit, Save, X } from 'lucide-react';
import { COMMON_SKILLS, UNIVERSITIES, COMMON_ROLES } from '@/types';
import ProfileAvatars from '@/components/ProfileAvatars';
import ProfileLinks from '@/components/ProfileLinks';
import { TypeaheadSelect } from '@/components/ui/TypeaheadSelect';

const Profile = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    university: '',
    bio: '',
    interests: [] as string[],
    skills: [] as string[],
    avatar_url: '',
    github_url: '',
    linkedin_url: '',
    leetcode_url: '',
    codeforces_url: '',
    geeksforgeeks_url: '',
    codingame_url: '',
    portfolio_url: '',
    gender: '',
    roles: [] as string[],
  });
  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [universitySearch, setUniversitySearch] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        university: profile.university || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        skills: profile.skills || [],
        avatar_url: profile.avatar_url || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        leetcode_url: profile.leetcode_url || '',
        codeforces_url: profile.codeforces_url || '',
        geeksforgeeks_url: profile.geeksforgeeks_url || '',
        codingame_url: profile.codingame_url || '',
        portfolio_url: profile.portfolio_url || '',
        gender: profile.gender || '',
        roles: profile.roles || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const updates = { ...formData, avatar_url: formData.avatar_url ? formData.avatar_url : null };
      await updateProfile(updates);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredUniversities = useMemo(() => {
    if (!universitySearch) return UNIVERSITIES;
    return UNIVERSITIES.filter(uni =>
      uni.toLowerCase().includes(universitySearch.toLowerCase())
    );
  }, [universitySearch]);

  return (
    <div className="container mx-auto px-4 py-6 flex-1 flex flex-col">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Profile
            {loading && profile && (
              <span className="ml-2 animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></span>
            )}
          </h1>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                // Reset form data
                setFormData({
                  full_name: profile?.full_name || '',
                  university: profile?.university || '',
                  bio: profile?.bio || '',
                  interests: profile?.interests || [],
                  skills: profile?.skills || [],
                  avatar_url: profile?.avatar_url || '',
                  github_url: profile?.github_url || '',
                  linkedin_url: profile?.linkedin_url || '',
                  leetcode_url: profile?.leetcode_url || '',
                  codeforces_url: profile?.codeforces_url || '',
                  geeksforgeeks_url: profile?.geeksforgeeks_url || '',
                  codingame_url: profile?.codingame_url || '',
                  portfolio_url: profile?.portfolio_url || '',
                  gender: profile?.gender || '',
                  roles: profile?.roles || [],
                });
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
                {profile?.avatar_url ? (
                  <AvatarImage src={`/avatars/${profile.avatar_url}`} alt="Avatar" />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name || formData.full_name)}
                </AvatarFallback>
              )}
            </Avatar>
              <div>
                <CardTitle>{profile?.full_name || formData.full_name || 'Profile'}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user && !profile ? (
              // Show loading skeleton only if not authenticated and no cached profile
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ) : isEditing ? (
              <>
                {/* Edit Form */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Profile Picture</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-20 h-20">
                        {formData.avatar_url ? (
                          <AvatarImage src={`/avatars/${formData.avatar_url}`} alt="Avatar" />
                        ) : (
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(formData.full_name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="ml-2">
                        <ProfileAvatars
                          selectedAvatar={formData.avatar_url}
                          onSelect={(avatar) => setFormData(prev => ({ ...prev, avatar_url: avatar }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="university">University</Label>
                    <TypeaheadSelect
                      options={UNIVERSITIES}
                      value={formData.university}
                      onValueChange={university => setFormData(prev => ({ ...prev, university: university as string }))}
                      placeholder="Select your university"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell others about yourself..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Roles (up to 3)</Label>
                    <TypeaheadSelect
                      options={COMMON_ROLES.filter(role => !formData.roles.includes(role))}
                      value={formData.roles}
                      onValueChange={roles => setFormData(prev => ({ ...prev, roles: roles as string[] }))}
                      placeholder="Add a role"
                      multiSelect
                      maxSelect={3}
                    />
                  </div>

                  <div>
                    <Label>Skills</Label>
                    <TypeaheadSelect
                      options={COMMON_SKILLS.filter(skill => !formData.skills.includes(skill))}
                      value={formData.skills}
                      onValueChange={skills => setFormData(prev => ({ ...prev, skills: skills as string[] }))}
                      placeholder="Add a skill"
                      multiSelect
                      maxSelect={99}
                    />
                  </div>

                  <div>
                    <Label>Interests</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest"
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      />
                      <Button type="button" variant="outline" onClick={addInterest}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                          {interest} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <div className="flex gap-2 mt-2">
                      {['male', 'female', 'others'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`px-4 py-2 rounded-full border font-medium transition-colors duration-150 focus:outline-none ${
                            formData.gender === option
                              ? 'bg-primary text-primary-foreground border-primary shadow'
                              : 'bg-muted text-muted-foreground border-border hover:bg-accent/10'
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, gender: option }))}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile Links */}
                  <ProfileLinks
                    profile={{ ...profile, ...formData }}
                    isEditing={true}
                    onLinksChange={(links) => setFormData(prev => ({ ...prev, ...links }))}
                  />
                </div>

                <Button onClick={handleSave} className="w-full btn-gradient">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div>
                  <h3 className="font-semibold mb-2">University</h3>
                  <p className="text-muted-foreground">{profile.university || 'Not specified'}</p>
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {profile.roles && profile.roles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.roles.map(role => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Gender</h3>
                  <p className="text-muted-foreground">{profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : 'Not specified'}</p>
                </div>

                {/* Profile Links */}
                <ProfileLinks profile={profile} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;