#include "RuntimeContext.h"
#include "GDCpp/RuntimeScene.h"
#include "GDCpp/RuntimeGame.h"
#include "GDCpp/profile.h"
#include <vector>

std::vector<RuntimeObject*> RuntimeContext::GetObjectsRawPointers(const std::string & name)
{
    return scene->objectsInstances.GetObjectsRawPointers(name);
}

RuntimeVariablesContainer & RuntimeContext::GetSceneVariables()
{
	return scene->GetVariables();
}

RuntimeVariablesContainer & RuntimeContext::GetGameVariables()
{
	return scene->game->GetVariables();
}

RuntimeContext & RuntimeContext::ClearObjectListsMap()
{
    temporaryMap.clear();

    return *this;
}

RuntimeContext & RuntimeContext::AddObjectListToMap(const std::string & objectName, std::vector<RuntimeObject*> & list)
{
    temporaryMap[objectName] = &list;

    return *this;
}

std::map <std::string, std::vector<RuntimeObject*> *> RuntimeContext::ReturnObjectListsMap()
{
    return temporaryMap;
}

