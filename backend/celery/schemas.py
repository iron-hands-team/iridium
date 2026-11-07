from pydantic import BaseModel, Field


class ArchiveSetting(BaseModel):
    number: int = 30
    duration: str = "Days"
    never: bool = False


class PostSetting(BaseModel):
    number: int = 30
    duration: str = "Days"
    never: bool = True


class SlowSetting(BaseModel):
    number: int = 30
    duration: str = "Seconds"
    enabled: bool = False


class CensoredSetting(BaseModel):
    words: list[str] = []
    sensitive: bool = False


class SettingsRequest(BaseModel):
    id: int | None = None
    features: list[str] = []
    archive: ArchiveSetting = Field(default_factory=ArchiveSetting)
    posts: PostSetting = Field(default_factory=PostSetting)
    messages: ArchiveSetting = Field(default_factory=ArchiveSetting)
    slow: SlowSetting = Field(default_factory=SlowSetting)
    censored: CensoredSetting = Field(default_factory=CensoredSetting)
    paused: bool | None = None

    class Config:
        from_attributes = True
