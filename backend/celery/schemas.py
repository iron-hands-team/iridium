from pydantic import BaseModel


class ArchiveSetting(BaseModel):
    number: int
    duration: str
    never: bool | None = None


class SlowSetting(BaseModel):
    number: int
    duration: str
    enabled: bool | None = None


class CensoredSetting(BaseModel):
    words: list[str]
    sensitive: bool | None = None


class SettingsRequest(BaseModel):
    id: int | None = None
    features: list[str]
    archive: ArchiveSetting
    messages: ArchiveSetting
    slow: SlowSetting
    censored: CensoredSetting
    paused: bool | None = None

    class Config:
        from_attributes = True
