import { createSelector, OutputSelector } from "reselect";
import { EntityCollection, EntityCollectionsState, getEntityCollection } from "./EntityCollection";
import { EntitySingle, EntitySinglesState, getEntitySingle } from "./EntitySingle";
import { getCollections, getEntities, getPage, getPages, getSingles, PagesState } from "./index";
import { EntitiesState, RootState } from "./RootState";

export const entitieSinglesSelector: OutputSelector<RootState, EntitySinglesState, (res: EntitiesState) => EntitySinglesState> = createSelector(getEntities, getSingles);
export const entitieCollectionsSelector: OutputSelector<RootState, EntityCollectionsState, (res: EntitiesState) => EntityCollectionsState> = createSelector(getEntities, getCollections);

export function createEntitySingleSelector<T>(entityName: string): OutputSelector<RootState, EntitySingle<T>, (res: EntitySinglesState) => EntitySingle<T>> {
  return createSelector(
    entitieSinglesSelector,
    (entitySingles: EntitySinglesState) => getEntitySingle<T>(entitySingles, entityName),
  );
}

export function createEntityCollectionSelector<T>(entityName: string): OutputSelector<RootState, EntityCollection<T>, (res: EntityCollectionsState) => EntityCollection<T>> {
  return createSelector(
    entitieCollectionsSelector,
    (entityCollections: EntityCollectionsState) => getEntityCollection<T>(entityCollections, entityName),
  );
}

export function createPageSelector<T>(pageName: string) {
  return createSelector(
    getPages,
    (pages: PagesState) => getPage<T>(pages, pageName),
  );
}
