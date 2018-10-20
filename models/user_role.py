import json
from enum import (
    Enum,
    auto,
)


class UserRole(Enum):
    guest = auto()
    normal = auto()


class GuaEncoder(json.JSONEncoder):
    prefix = "__enum__"

    def default(self, o):
        if isinstance(o, UserRole):
            return {self.prefix: o.name}
        else:
            return super().default(o)


def gua_decode(d):
    if GuaEncoder.prefix in d:
        name = d[GuaEncoder.prefix]
        return UserRole[name]
    else:
        return d
