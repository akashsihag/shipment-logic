import { ContainerSpec, OrderRequest, ShipmentRecord, Containers, ContainingProducts } from "./interfaces";
import { Utils} from "./utils";


export class OrderHandler {
  private containerSpecs: ContainerSpec[];
  constructor(private parameters: { containerSpecs: ContainerSpec[] }) {
    this.containerSpecs = parameters.containerSpecs
  }

  packOrder(orderRequest: OrderRequest): ShipmentRecord {

    const containers: Array<Containers> = [];
    const containingProducts: Array<ContainingProducts> = [];
    var containerVolume: number = 0
    var tillProd = 0
    
    orderRequest.products.forEach((product) => {
      const productVolumne = Utils.getVolume(product.dimensions.length, product.dimensions.height, product.dimensions.width)
      
      var productsPacked = 0
      var containingProds = 0
      var productsToPack = product.orderedQuantity - productsPacked
      var containerType = ""

      while (productsToPack) {

        var conatinerAvailable = 0
        this.containerSpecs.forEach(container => {

          if (Utils.validatePackage([container.dimensions.length, container.dimensions.width, container.dimensions.height], 
            [product.dimensions.length, product.dimensions.width, product.dimensions.height])) {

            conatinerAvailable = 1
            containerVolume = containerVolume + Utils.getVolume(container.dimensions.length, container.dimensions.height, container.dimensions.width)
            var remainingCapacity = container.dimensions.length * container.dimensions.height * container.dimensions.width

            while (productsToPack > 0 && remainingCapacity >= productVolumne) {
              containerType = container.containerType
              productsPacked += 1
              productsToPack -= 1
              remainingCapacity = remainingCapacity - productVolumne
            }
          }
          if (containerType != "" && containingProds != -1) {
            containingProds -= 1
            containingProducts.push({
              id: product.id,
              quantity: productsPacked
            })
          }
        })

        if (conatinerAvailable == 0) {
          throw new Error("Orders can not fit into any containers")
        }

        if (containerType != "") {
          if (tillProd == 0) {
            containers.push({
              containerType: containerType,
              containingProducts: containingProducts
            })
          }
          else {
            containers.push({
              containerType: containerType,
              containingProducts: [{
                id: product.id,
                quantity: tillProd
              }]
            })
          }
          tillProd += 1
        }
      }

    });

    const shipmentRecord: ShipmentRecord = {
      orderId: orderRequest.id,
      totalVolume: {
        unit: "cubic centimeter",
        value: containerVolume,
      },
      containers: containers
    }

    return shipmentRecord;

  }
}
